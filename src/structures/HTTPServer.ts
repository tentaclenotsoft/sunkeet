import { Request, Response } from 'express'

import Database from './Database'
import type Account from './steam/Account'

export default class HTTPServer {
  accounts: Map<string, Account>
  database: Database
  http: {}

  constructor ({ accounts, database, http }) {
    this.accounts = accounts
    this.database = database
    this.http = http

    this.initializeRoutes()
  }

  initializeRoutes () {
    this.routes.map(([method, path, fn]: [string, string, () => any]) =>
      this.http[method.toLowerCase()](path, fn)
    )
  }

  get routes () {
    return [
      [
        'GET',
        '/api/ok',
        (request: Request, response: Response) =>
          response.status(200).json({ ok: true })
      ]
    ]
  }
}
