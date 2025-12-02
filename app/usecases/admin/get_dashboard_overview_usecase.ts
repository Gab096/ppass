import Admin from '#models/admin'

type DashboardStats = {
  totalUsers: number
  totalAdmins: number
}

type DashboardResult = {
  message: string
  admin: {
    id: number
    email: string
    fullName: string | null
  }
  stats: DashboardStats
}

export default class GetDashboardOverviewUseCase {
  /**
   * Retorna as informações para o dashboard administrativo.
   * No futuro, estatísticas reais podem ser injetadas via repositórios/serviços.
   */
  async execute(admin: Admin): Promise<DashboardResult> {
    const stats: DashboardStats = {
      totalUsers: 0,
      totalAdmins: 0,
    }

    return {
      message: 'Bem-vindo ao Dashboard Administrativo',
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
      },
      stats,
    }
  }
}

