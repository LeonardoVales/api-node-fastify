import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'new transaction',
      amount: 5000,
      type: 'credit',
    })

    // const cookies = res

    const cookies = response.get('Set-Cookie')
    const listTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
    expect(200)

    expect(listTransactions.body.transactions).toEqual([
      expect.objectContaining({
        title: 'new transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get specific transation', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'new transaction',
      amount: 5000,
      type: 'credit',
    })

    // const cookies = res

    const cookies = response.get('Set-Cookie')
    const listTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
    expect(200)

    const transactionId = listTransactions.body.transactions[0].id

    const getTransaction = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies!)

    expect(getTransaction.body.transaction).toEqual(
      expect.objectContaining({
        title: 'new transaction',
        amount: 5000,
      }),
    )
  })
})
