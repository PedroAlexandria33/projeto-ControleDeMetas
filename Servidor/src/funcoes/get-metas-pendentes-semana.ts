import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goals, metasCumpridas } from '../db/schema'
import { and, lte, sql, count, gte, eq } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export async function getMetasPendentesSemana() {
  const ultimoDiadaSemana = dayjs().endOf('week').toDate()
  const primeiroDiaSemana = dayjs().startOf('week').toDate()

  //goalsCreatedUpToWeek === todas as metas criadas até a semana atual
  const goalsCreatedUpToWeek = db.$with('metas_criada_ate_semana').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, ultimoDiadaSemana))
  )

  //nesse código de baixo estou selecionando todos os registros da tabela de metas cumpridas
  const contagemDeMetasConcluidas = db.$with('contagem_de_metas_concluidas').as(
    db
      .select({
        metaId: metasCumpridas.metaId,
        metasCumpridas: count(metasCumpridas.id)
          .mapWith(Number)
          .as('completionsCount'), //sempre que existir uma situação dessa eu tenho que dar um nome pra ela, no caso eu usei o mesmo nome metasCumpridas
      })
      .from(metasCumpridas)
      .where(
        and(
          gte(metasCumpridas.createdAt, primeiroDiaSemana), //to agrupando as metas pelo id da meta
          lte(metasCumpridas.createdAt, ultimoDiadaSemana) //e também estou fazendo um caulculo de
        ) //quantas vezes aquela meta foi concluida
      )
      .groupBy(metasCumpridas.metaId)
  )

  const metasPendentes = await db
    .with(goalsCreatedUpToWeek, contagemDeMetasConcluidas)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      contagemDeMetasConcluidas:
        sql /*sql*/`COALESCE(${contagemDeMetasConcluidas.metasCumpridas}, 0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      contagemDeMetasConcluidas,
      eq(contagemDeMetasConcluidas.metaId, goalsCreatedUpToWeek.id)
    )

  return { metasPendentes }
}
//repare que esse with de 'const pedingGoals' está sem o'$' pois agora eu não estou criando uma common table expression (expessçao de tabela comum) eu estou criando uma query que vai usar dessas duas outras que eu montei lá em cima
