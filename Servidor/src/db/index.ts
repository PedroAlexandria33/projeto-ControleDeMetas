import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema' // como meu arquivo tem varias varáveis de exportação eu vou usar o " * " para importar tudo que o arquivo está exportando
import { env } from '../env'

export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, { schema, logger: true }) // logger: true vai dar log em todas as querys do banco de dados
