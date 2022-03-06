import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const { CRYPTO_ALGORITHM, CRYPTO_SECRET_KEY } = process.env
const INIT_VECTOR_LENGTH = 16

export default class Crypto {
  static encrypt (text: string): string {
    const initVector = randomBytes(INIT_VECTOR_LENGTH)
    const cipher = createCipheriv(
      CRYPTO_ALGORITHM,
      Buffer.from(CRYPTO_SECRET_KEY),
      initVector
    )
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return `${initVector.toString('hex')}:${encrypted.toString('hex')}`
  }

  static decrypt (hash: string): string {
    const hashParts = hash.split(':')
    const initVector = Buffer.from(hashParts.shift(), 'hex')
    const encryptedText = Buffer.from(hashParts.join(':'), 'hex')
    const decipher = createDecipheriv(
      CRYPTO_ALGORITHM,
      Buffer.from(CRYPTO_SECRET_KEY),
      initVector
    )
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
  }
}
