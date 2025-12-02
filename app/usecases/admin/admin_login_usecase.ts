import Admin from '#models/admin'

type LoginResult = {
  type: 'bearer'
  token: string
  admin: {
    id: number
    email: string
    fullName: string | null
  }
}

export default class AdminLoginUseCase {
  /**
   * Executa o fluxo de autenticação do administrador.
   */
  async execute(email: string, password: string): Promise<LoginResult> {
    const admin = await Admin.verifyCredentials(email, password)
    const token = await Admin.accessTokens.create(admin)

    return {
      type: 'bearer',
      token: token.value!.release(),
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
      },
    }
  }
}

