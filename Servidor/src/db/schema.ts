import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2' //importar comando pra gerar id

//goals = meta em inglês,
export const goals = pgTable('goals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_franquency').notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
})

//eu troquei o nome aviadado goals por apenas metas, se liga
export const metasCumpridas = pgTable('metas_cumpridas', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()), // esse código faz gerar um id
  metaId: text('meta_id')
    .references(() => goals.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})
