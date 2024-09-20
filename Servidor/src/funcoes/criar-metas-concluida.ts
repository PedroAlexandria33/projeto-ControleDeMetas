import dayjs from 'dayjs'
import { db } from '../db'
import { goals, metasCumpridas } from '../db/schema'
import { count, and, gte, lte, eq, sql } from 'drizzle-orm'

interface CriarMetaConcluidaRequest {
  metaId: string
}

export async function CriarMetaConcluidaRequest({
  metaId,
}: CriarMetaConcluidaRequest) {
  const ultimoDiadaSemana = dayjs().endOf('week').toDate()
  const primeiroDiaSemana = dayjs().startOf('week').toDate()
  const contagemDeMetasConcluidas = db.$with('contagem_de_metas_concluidas').as(
    db
      .select({
        metaId: metasCumpridas.metaId,
        metasCumpridas: count(metasCumpridas.id).as('completionsCount'), //sempre que existir uma situação dessa eu tenho que dar um nome pra ela, no caso eu usei o mesmo nome metasCumpridas
      })
      .from(metasCumpridas)
      .where(
        and(
          gte(metasCumpridas.createdAt, primeiroDiaSemana), //to agrupando as metas pelo id da meta
          lte(metasCumpridas.createdAt, ultimoDiadaSemana), //e também estou fazendo um caulculo de
          eq(metasCumpridas.metaId, metaId)
        ) //quantas vezes aquela meta foi concluida
      )
      .groupBy(metasCumpridas.metaId)
  )
  const result = await db
    .with(contagemDeMetasConcluidas)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionsCount: sql /*sql*/`
      COALESCE(${contagemDeMetasConcluidas.metasCumpridas}, 0)
    `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(
      contagemDeMetasConcluidas,
      eq(contagemDeMetasConcluidas.metaId, goals.id)
    )
    .where(eq(goals.id, metaId))
    .limit(1)

  const { completionsCount, desiredWeeklyFrequency } = result[0]

  if (completionsCount >= desiredWeeklyFrequency) {
    throw new Error('A meta já foi concluída essa semana')
  }

  const insertResult = await db
    .insert(metasCumpridas)
    .values({ metaId })
    .returning()

  const metaConcluida = insertResult[0]

  return { metaConcluida }
}
