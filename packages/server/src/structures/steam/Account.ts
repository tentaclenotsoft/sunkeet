/* eslint-disable camelcase */
import SteamUser from 'steam-user'

import Crypto from '../../utils/Crypto'
import type Database from '../Database'
import type Logger from '../Logger'

interface IAccount {
  seq: number
  steam_id: string
  enabled: boolean
  credentials: {
    username: string
    password: string
    sentry: {
      buffer: Buffer
    }
  }
  preferences: {
    status: number
    play_games: boolean
    games_id: number[]
  }
}

export default class Account extends SteamUser {
  logger: Logger
  database: Database
  account: IAccount

  playStateBlocked: boolean

  constructor ({ logger, database, account }) {
    super({ dataDirectory: null })

    this.logger = logger
    this.database = database
    this.account = account

    this.playStateBlocked = false

    this.on('loggedOn', this.onLoggedOn)
    this.on('sentry', this.onSentry)
    this.on('playingState', this.onPlayingState)
    this.on('disconnected', this.onDisconnected)
    this.on('error', this.onError)
  }

  makeLogOn ({ credentials } = this.account) {
    if (credentials.sentry) this.setSentry(credentials.sentry.buffer)

    this.logOn({
      accountName: credentials.username,
      password: Crypto.decrypt(credentials.password)
    })

    return true
  }

  idleGames (playGames = this.account.preferences.play_games) {
    if (this.playStateBlocked) {
      this.logger.warn('Game state is locked')

      return setTimeout(() => this.idleGames(), 90 * 1e3)
    }

    const gamesID = this.account.preferences?.games_id

    if (playGames && gamesID.length) {
      this.gamesPlayed(gamesID)
      this.logger.info(
        `Playing ${gamesID.length} game${gamesID.length > 1 ? 's' : ''}`
      )
    } else {
      this.gamesPlayed([])
      this.logger.info('Paused games')
    }
  }

  onLoggedOn () {
    const status = this.account.preferences.status

    this.setPersona(status)
    this.logger.info(`Connected to Steam (${SteamUser.EPersonaState[status]})`)
    this.idleGames()
  }

  onSentry (sentry) {
    this.database.accounts
      .update(
        {
          _id: this.steamID.getSteamID64()
        },
        { $set: { 'credentials.sentry': sentry } }
      )
      .then(() =>
        this.logger.info(`Sentry of ${this.steamID} has been updated`)
      )
      .catch((error) => this.logger.error(error.message))
  }

  onPlayingState (blocked) {
    if (this.playStateBlocked !== blocked) this.playStateBlocked = blocked
  }

  onDisconnected (eresult, message) {
    this.logger.warn(`${eresult}=${message}`)
  }

  onError (error) {
    if (error.eresult === SteamUser.EResult.LoggedInElsewhere) {
      this.playStateBlocked = true
      setTimeout(() => this.makeLogOn(), 60 * 5 * 1e3)
    }

    this.logger.warn(error.message)
  }
}
