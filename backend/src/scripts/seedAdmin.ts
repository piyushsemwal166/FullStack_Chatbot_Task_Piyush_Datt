import bcrypt from 'bcryptjs'
import { connectDatabase, disconnectDatabase } from '../config/database'
import { env } from '../config/env'
import { Admin } from '../models/Admin'

async function seedAdmin(): Promise<void> {
  await connectDatabase()
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12)
  await Admin.findOneAndUpdate(
    { email: env.ADMIN_EMAIL },
    { $set: { name: env.ADMIN_NAME, passwordHash, role: 'admin' } },
    { upsert: true, new: true }
  )
  console.log(`Admin account seeded for ${env.ADMIN_EMAIL}`)
}

seedAdmin()
  .catch((error: unknown) => {
    console.error('Unable to seed admin account', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectDatabase()
  })
