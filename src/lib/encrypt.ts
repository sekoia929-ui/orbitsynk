import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required. Set a 32-character random string.')
}

// AES-256 requires exactly 32 bytes. Validate at startup rather than silently
// truncating (too long) or throwing a cryptic "Invalid key length" at call time (too short).
if (Buffer.byteLength(ENCRYPTION_KEY, 'utf8') < 32) {
  throw new Error(
    `ENCRYPTION_KEY must be at least 32 bytes. Current length: ${Buffer.byteLength(ENCRYPTION_KEY, 'utf8')} bytes. ` +
    'Run: openssl rand -hex 16'
  )
}

// Key must be exactly 32 bytes for AES-256
const key = Buffer.from(ENCRYPTION_KEY, 'utf8').slice(0, 32)

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(encryptedText: string): string {
  const [ivHex, tagHex, dataHex] = encryptedText.split(':')
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error('Invalid encrypted text format')
  }
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
  return decrypted.toString('utf8')
}
