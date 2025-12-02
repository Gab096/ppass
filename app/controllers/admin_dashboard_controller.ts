import type { HttpContext } from '@adonisjs/core/http'
import GetDashboardOverviewUseCase from '#usecases/admin/get_dashboard_overview_usecase'
import GetAdminProfileUseCase from '#usecases/admin/get_admin_profile_usecase'

export default class AdminDashboardController {
  private readonly dashboardUseCase = new GetDashboardOverviewUseCase()
  private readonly profileUseCase = new GetAdminProfileUseCase()

  /**
   * Exibe o dashboard administrativo
   */
  async index({ auth, response }: HttpContext) {
    const admin = auth.getUserOrFail()
    const dashboard = await this.dashboardUseCase.execute(admin)
    return response.json(dashboard)
  }

  /**
   * Retorna informações do admin autenticado
   */
  async profile({ auth, response }: HttpContext) {
    const admin = auth.getUserOrFail()
    const profile = this.profileUseCase.execute(admin)
    return response.json(profile)
  }
}

