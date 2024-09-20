import { db } from '../db'
import { goals } from '../db/schema'

interface CriandoMetasRequest {
  title: string
  desiredWeeklyFrequency: number
}

export async function criandoMeta({
  title,
  desiredWeeklyFrequency,
}: CriandoMetasRequest) {
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  const meta = result[0]

  return {
    meta,
  }
}
