import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getMetasPendentesSemana } from '../../funcoes/get-metas-pendentes-semana'
export const rotaMetaPendente: FastifyPluginAsyncZod = async app => {
  app.get('/metas-pendentes', async () => {
    const { metasPendentes } = await getMetasPendentesSemana()

    return { metasPendentes }
  })
}
