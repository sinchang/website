import { integer, pgTable } from 'drizzle-orm/pg-core'

export const loveTable = pgTable('love', {
  count: integer().notNull(),
})
