import Admin from '#models/admin'

type CreateAdminData = {
  email: string
  password: string
  fullName?: string
  accessLevel: number
  cargo?: string
}

type CreateAdminResult = {
  id: string
  email: string
  fullName: string | null
  accessLevel: number
  cargo: string | null
  createdAt: Admin['createdAt']
}

export default class CreateAdminUseCase {
  /**
   * Cria um novo administrador (apenas super admin pode executar)
   */
  async execute(data: CreateAdminData): Promise<CreateAdminResult> {
    // Verificar se já existe um admin com este email
    const existingAdmin = await Admin.findBy('email', data.email)
    if (existingAdmin) {
      throw new Error('Já existe um administrador com este email')
    }

    // Validar accessLevel (deve ser entre 1 e 5)
    if (data.accessLevel < 1 || data.accessLevel > 5) {
      throw new Error('Nível de acesso deve ser entre 1 e 5')
    }

    // Não permitir criar outro super admin (accessLevel 1)
    // Só pode existir um super admin no sistema (criado pelo seed)
    if (data.accessLevel === 1) {
      const existingSuperAdmin = await Admin.findBy('accessLevel', 1)
      if (existingSuperAdmin) {
        throw new Error('Já existe um super administrador no sistema. Não é possível criar outro.')
      }
    }

    // Criar o admin
    const admin = await Admin.create({
      email: data.email,
      password: data.password,
      fullName: data.fullName || null,
      accessLevel: data.accessLevel,
      cargo: data.cargo || null,
    })

    return {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      accessLevel: admin.accessLevel,
      cargo: admin.cargo,
      createdAt: admin.createdAt,
    }
  }
}

