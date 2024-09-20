import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CriarMetaConcluidaRequest } from '../../funcoes/criar-metas-concluida'
export const rotaMetaConcluida: FastifyPluginAsyncZod = async app => {
  app.post(
    '/metas-concluidas',
    {
      schema: {
        body: z.object({
          metaId: z.string(),
        }),
      },
    },
    async request => {
      const { metaId } = request.body
      await CriarMetaConcluidaRequest({
        metaId,
      })
    }
  )
}
