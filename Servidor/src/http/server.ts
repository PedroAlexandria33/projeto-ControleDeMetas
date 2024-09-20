//Se você tiver problemas em executar alguma coisa com o postman gerando erro 500, verifica se o docker ta rodando o bando de dados, se não time executa o código que está entre chaves { docker compose up -d } ou então vai no aplicativo do docker e executa o banco lá

import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { rotaCriaMeta } from './routes/post-cria-meta'
import { rotaMetaConcluida } from './routes/post-metas-concluidas'
import { rotaMetaPendente } from './routes/get-metas-pendentes'
import { rotaResumoMetasSemana } from './routes/get-resumo-metas-semana'
import fastifyCors from '@fastify/cors'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(rotaCriaMeta)
app.register(rotaMetaConcluida)
app.register(rotaMetaPendente)
app.register(rotaResumoMetasSemana)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running')
  })
