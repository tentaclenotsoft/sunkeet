import Mongoose from 'mongoose'

import Repositories from '../database/repositories'
import AccountRepository from '../database/repositories/AccountRepository'
import type Logger from './Logger'

export default class Database {
  readonly accounts: AccountRepository

  readonly logger: Logger

  constructor ({ logger }) {
    this.logger = logger
  }

  connect (uri = process.env.MONGO_URI) {
    if (!uri) {
      this.logger.warn(
        'Database not started - Environment variable "MONGO_URI" is not set'
      )

      return
    }

    return Mongoose.connect(uri).then((mongoose) => {
      for (const [name, Repository] of Repositories as [string, any][]) {
        this[name] = new Repository(mongoose)
      }
    })
  }
}
