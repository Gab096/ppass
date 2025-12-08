import Admin from '#models/admin'

type AdminListItem = {
  id: string
  email: string
  fullName: string | null
  accessLevel: number
  cargo: string | null
  createdAt: Admin['createdAt']
}

export default class ListAdminsUseCase {
  /**
   * Lista todos os administradores (apenas super admin pode executar)
   */
  async execute(): Promise<AdminListItem[]> {
    const admins = await Admin.query().select('id', 'email', 'full_name', 'access_level', 'cargo', 'created_at').orderBy('created_at', 'desc')

    return admins.map((admin) => ({
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      accessLevel: admin.accessLevel,
      cargo: admin.cargo,
      createdAt: admin.createdAt,
    }))
  }
}

