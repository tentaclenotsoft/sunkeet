import Express from 'express'

import Database from './structures/Database'
import HTTPServer from './structures/HTTPServer'
import Logger from './structures/Logger'

class Tupperware {
  logger: Logger
  database: Database | null
  http: any

  constructor () {
    this.logger = new Logger()

    this.database = null
    this.http = Express()

    this.initializeDatabase().then(() => this.initializeHTTPServer())
  }

  initializeDatabase () {
    this.database = new Database(this)
    return this.database
      .connect()
      .then(() => this.logger.info('Connection established'))
      .catch((error) => {
        this.logger.error(error.message)
        this.database = null
      })
  }

  initializeHTTPServer (port = process.env.PORT) {
    if (!port) {
      return this.logger.warn(
        'Server not started - Environment variable "PORT" is not set'
      )
    }

    this.http.use(Express.json())
    this.http.listen(port, () =>
      this.logger.info(`Server listening on port ${port}`)
    )

    return new HTTPServer(this)
  }
}

/* eslint-disable no-unused-vars */
const host = new Tupperware()
