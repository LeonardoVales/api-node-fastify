import fastify from 'fastify'
import cookie from '@fastify/cookie'
// import crypto from 'node:crypto'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

/**
 * Testes unitários: testa uma unidade da aplicação
 * Testes de integração: Testa a comunicação entre duas ou mais unidades
 * Testes e2e ou ponta a ponta: Simulam um usuário operando a aplicação
 */

app.register(cookie)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server Running')
  })
