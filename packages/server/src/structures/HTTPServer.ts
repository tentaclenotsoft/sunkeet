import { Request, Response } from 'express'
import { EPersonaState } from 'steam-user'

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
        '/api/v1/ok',
        (request: Request, response: Response) =>
          response.status(200).json({ ok: true })
      ],
      [
        'GET',
        '/api/v1/accounts/:id',
        async (request: Request, response: Response) => {
          const { id } = request.params

          try {
            const account = await this.database.accounts.findOne(id, {
              _id: 0,
              credentials: 0
            })

            response.status(200).json({ steam_id: id, ...account })
          } catch (error) {
            response.status(500).json({ message: error.message })
          }
        }
      ],
      [
        'POST',
        '/api/v1/accounts/:id/set_status',
        async (request: Request, response: Response) => {
          const { id } = request.params
          const { status } = request.body

          try {
            await this.database.accounts.update(
              { _id: id },
              { $set: { 'preferences.status': status } }
            )
            this.accounts.get(id).setPersona(status)

            response
              .status(200)
              .json({ message: `Status changed to ${EPersonaState[status]}` })
          } catch (error) {
            response.status(500).json({ message: error.message })
          }
        }
      ],
      [
        'POST',
        '/api/v1/accounts/:id/toggle_play_games',
        async (request: Request, response: Response) => {
          const { id } = request.params
          const { enable } = request.body

          try {
            await this.database.accounts.update(
              { _id: id },
              { $set: { 'preferences.play_games': enable } }
            )
            this.accounts.get(id).idleGames(enable)

            response.status(200).json({
              message: `Play games ${enable ? 'enabled' : 'disabled'}`
            })
          } catch (error) {
            response.status(500).json({ message: error.message })
          }
        }
      ],
      [
        'POST',
        '/api/v1/accounts/:id/games/add',
        async (request: Request, response: Response) => {
          const { id } = request.params
          const { games_id } = request.body // eslint-disable-line

          try {
            await this.database.accounts.update(
              { _id: id },
              { $push: { 'preferences.games_id': games_id } }
            )
            this.accounts.get(id).idleGames()

            response.status(200).json({
              message: `${games_id?.length} new game${
                games_id?.length > 1 ? 's' : ''
              } have been added`
            })
          } catch (error) {
            response.status(500).json({ message: error.message })
          }
        }
      ]
    ]
  }
}
