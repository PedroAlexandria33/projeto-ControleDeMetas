import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { criandoMeta } from '../../funcoes/criando-meta'

export const rotaCriaMeta: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
    },
    async request => {
      const { title, desiredWeeklyFrequency } = request.body
      await criandoMeta({
        title,
        desiredWeeklyFrequency,
      })
    }
  )
}
