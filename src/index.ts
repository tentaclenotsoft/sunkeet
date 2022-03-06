/* eslint-disable no-unused-vars */
import Express from 'express'

import Database from './structures/Database'
import HTTPServer from './structures/HTTPServer'
import Logger from './structures/Logger'
import Account from './structures/steam/Account'

class Tupperware {
  logger: Logger
  database: Database | null
  http: any
  accounts: Map<string, Account>

  constructor () {
    this.logger = new Logger()

    this.database = null
    this.http = Express()
    this.accounts = new Map()

    this.initializeDatabase().then(async () => {
      await this.prepareAccounts()

      this.initializeHTTPServer()
      this.initializeAccounts(
        Array.from(this.accounts, ([steamID, account]) => [steamID, account])
      )
    })
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

  async prepareAccounts () {
    ;(await this.database.accounts.findAll({ enabled: true })).map(
      (account, index) =>
        this.accounts.set(
          account.steam_id,
          new Account({
            logger: new Logger({
              name: account.steam_id,
              displayLoggerName: true,
              requestId: index + 1
            }),
            database: this.database,
            account: { seq: index, ...account }
          })
        )
    )
  }

  initializeAccounts (accounts) {
    this.logger.info(`${accounts.length} accounts for startup`)

    accounts.forEach(([, account], index) =>
      setTimeout(() => account.makeLogOn(), index * 10 * 1e3)
    )
  }
}

const host = new Tupperware()
