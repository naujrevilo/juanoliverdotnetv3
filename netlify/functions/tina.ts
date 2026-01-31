import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import { AuthJsBackendAuthentication } from '@tinacms/auth'
import databaseClient from '../../tina/database'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthentication({
        secret: process.env.NEXTAUTH_SECRET || 'secret',
      }),
  databaseClient,
})

export default async (req, context) => {
  return handler(req, context)
}
