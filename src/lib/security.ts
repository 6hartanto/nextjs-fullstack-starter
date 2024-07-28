import { bcrypt, bcryptVerify } from 'hash-wasm'
import { getRandomValues } from 'uncrypto'

export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16)

  getRandomValues(salt)

  return await bcrypt({
    password,
    salt, // salt is a buffer containing 16 random bytes
    costFactor: 12,
    outputType: 'encoded', // return standard encoded string
  })
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcryptVerify({ password, hash })
}
