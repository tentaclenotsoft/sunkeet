import { Request, Response } from 'express'

import Database from './Database'

export default class HTTPServer {
  database: Database
  http: {}

  constructor ({ database, http }) {
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
