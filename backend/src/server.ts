import bcrypt from 'bcryptjs'
import { createApp } from './app'
import { connectDatabase } from './config/database'
import { env } from './config/env'
import { Admin } from './models/Admin'

async function bootstrap(): Promise<void> {
  await connectDatabase()
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12)
  await Admin.findOneAndUpdate({ email: env.ADMIN_EMAIL }, { $setOnInsert: { name: env.ADMIN_NAME, email: env.ADMIN_EMAIL, passwordHash, role: 'admin' } }, { upsert: true, new: true })
  createApp().listen(env.PORT, () => console.log(`DroneTV backend listening on port ${env.PORT}`))
}

bootstrap().catch((error: unknown) => {
  console.error('Unable to start backend', error)
  process.exit(1)
})
