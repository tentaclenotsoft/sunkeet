import { Schema } from 'mongoose'

import Crypto from '../../utils/Crypto'

const CredentialsSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    sentry: Buffer
  },
  { id: false, _id: false }
)

CredentialsSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = Crypto.encrypt(this.password)
    next()
  }
})

const PreferencesSchema = new Schema(
  {
    status: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7], default: 1 },
    play_games: { type: Boolean, default: true },
    games_id: [{ type: Number }]
  },
  { id: false, _id: false }
)

export default new Schema(
  {
    _id: { type: String, required: true, alias: 'steam_id' },
    enabled: { type: Boolean, default: true },
    credentials: CredentialsSchema,
    preferences: PreferencesSchema,
    added_by: { type: Number, default: 0 }
  },
  { id: false }
)
