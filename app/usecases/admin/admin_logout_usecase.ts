import Admin from '#models/admin'

export default class AdminLogoutUseCase {
  /**
   * Revoga o token atual do administrador autenticado.
   */
  async execute(admin: Admin, tokenIdentifier?: string | null) {
    if (!tokenIdentifier) {
      return
    }

    await Admin.accessTokens.delete(admin, tokenIdentifier)
  }
}

