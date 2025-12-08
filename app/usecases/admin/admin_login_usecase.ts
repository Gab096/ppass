import Admin from '#models/admin'
import Database from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type LoginResult = {
  type: 'bearer'
  token: string
  expiresAt: string | null
  admin: {
    id: string
    email: string
    fullName: string | null
    accessLevel: number
  }
}

export default class AdminLoginUseCase {
  /**
   * Executa o fluxo de autenticação do administrador.
   */
  async execute(email: string, password: string): Promise<LoginResult> {
    const admin = await Admin.verifyCredentials(email, password)

    // Criar token
    const token = await Admin.accessTokens.create(admin)
    const tokenValue = token.value!.release()

    // Configurar expiração de 24 horas e atualizar no banco
    const expiresAt = DateTime.now().plus({ hours: 24 })
    await Database.from('admin_access_tokens')
      .where('tokenable_id', admin.id)
      .where('type', 'admin')
      .orderBy('created_at', 'desc')
      .limit(1)
      .update({
        expires_at: expiresAt.toJSDate(),
      })

    // Buscar o token do banco para obter o expiresAt atualizado
    const tokenRecord = await Database.from('admin_access_tokens')
      .where('tokenable_id', admin.id)
      .where('type', 'admin')
      .orderBy('created_at', 'desc')
      .first()

    return {
      type: 'bearer',
      token: tokenValue,
      expiresAt: tokenRecord?.expires_at ? new Date(tokenRecord.expires_at).toISOString() : null,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        accessLevel: admin.accessLevel,
      },
    }
  }
}
