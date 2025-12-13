import Admin from '#models/admin'
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

    // Configurar expiração de 24 horas
    const expiresAt = DateTime.now().plus({ hours: 24 })
    const expiresAtISO = expiresAt.toISO()

    // Criar token - expiresIn em segundos baseado no mesmo expiresAt
    const expiresInSeconds = expiresAt.diff(DateTime.now(), 'seconds').seconds
    const token = await Admin.accessTokens.create(admin, [], { expiresIn: expiresInSeconds })
    const tokenValue = token.value!.release()

    return {
      type: 'bearer',
      token: tokenValue,
      expiresAt: expiresAtISO,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        accessLevel: admin.accessLevel,
      },
    }
  }
}
