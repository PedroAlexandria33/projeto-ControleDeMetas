import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { resumoDeMetasSemana } from '../../funcoes/reumo-metas-semana'

export const rotaResumoMetasSemana: FastifyPluginAsyncZod = async app => {
  app.get('/resumo', async () => {
    const { resumo } = await resumoDeMetasSemana()

    return { resumo }
  })
}
