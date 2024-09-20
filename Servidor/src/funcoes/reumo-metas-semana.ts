import dayjs from 'dayjs'
import { db } from '../db'
import { metasCumpridas, goals } from '../db/schema'
import { and, eq, gte, lte, sql, desc } from 'drizzle-orm'

export async function resumoDeMetasSemana() {
  const ultimoDiadaSemana = dayjs().endOf('week').toDate()
  const primeiroDiaSemana = dayjs().startOf('week').toDate()

  //metas criadas na semana
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

  //contagem de meta concluída na semana
  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: metasCumpridas.id,
        title: goals.title,
        completedAt: metasCumpridas.createdAt,

        completedAtDate: sql /*sql*/`
        DATE(${metasCumpridas.createdAt})
      `.as('completedAtDate'),
      })
      .from(metasCumpridas)
      .innerJoin(goals, eq(goals.id, metasCumpridas.metaId))

      .where(
        and(
          gte(metasCumpridas.createdAt, primeiroDiaSemana),
          lte(metasCumpridas.createdAt, ultimoDiadaSemana)
        )
      )
      .orderBy(desc(metasCumpridas.createdAt))
  )
  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        completions: sql /*sql*/`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${goalsCompletedInWeek.id},
            'title', ${goalsCompletedInWeek.title},
            'completedAt', ${goalsCompletedInWeek.completedAt}
          )
        )
      `.as('completions'),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
      .orderBy(desc(goalsCompletedInWeek.completedAtDate))
  )
  type MetasPorDia = Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >
  const result = await db
    .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql /*sql*/`
        (SELECT COUNT(*) FROM${goalsCompletedInWeek})
      `.mapWith(Number),
      total: sql /*sql*/`
        (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM${goalsCreatedUpToWeek})
      `.mapWith(Number),
      metasPorDia: sql /*sql*/<MetasPorDia>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `,
    })
    .from(goalsCompletedByWeekDay)

  return {
    resumo: result[0],
  }
}
