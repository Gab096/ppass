import type { HttpContext } from '@adonisjs/core/http'
import AdminLoginUseCase from '#usecases/admin/admin_login_usecase'
import AdminLogoutUseCase from '#usecases/admin/admin_logout_usecase'
import GetAdminProfileUseCase from '#usecases/admin/get_admin_profile_usecase'
import { adminLoginValidator } from '#validators/admin_login_validator'

export default class AdminAuthController {
  private readonly loginUseCase = new AdminLoginUseCase()
  private readonly logoutUseCase = new AdminLogoutUseCase()
  private readonly profileUseCase = new GetAdminProfileUseCase()

  /**
   * Realiza login do admin
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(adminLoginValidator)

    try {
      const result = await this.loginUseCase.execute(email, password)

      return response.json(result)
    } catch {
      return response.unauthorized({ message: 'Credenciais inválidas' })
    }
  }

  /**
   * Realiza logout do admin
   */
  async logout({ auth, response }: HttpContext) {
    const admin = auth.getUserOrFail()
    const rawIdentifier = auth.user?.currentAccessToken?.identifier
    const tokenIdentifier = rawIdentifier !== undefined && rawIdentifier !== null ? String(rawIdentifier) : null
    await this.logoutUseCase.execute(admin, tokenIdentifier)

    return response.json({ message: 'Logout realizado com sucesso' })
  }

  /**
   * Retorna o admin autenticado
   */
  async me({ auth, response }: HttpContext) {
    const admin = auth.getUserOrFail()
    const profile = this.profileUseCase.execute(admin)
    return response.json(profile)
  }
}

