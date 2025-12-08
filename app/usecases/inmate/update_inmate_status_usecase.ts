import Inmate from '#models/inmate'
import InmateStatus from '#models/inmate_status'

type UpdateInmateStatusData = {
  status: 'liberado' | 'bloqueado' | 'atenção'
  notes?: string | null
  adminId?: string | null
}

export default class UpdateInmateStatusUseCase {
  async execute(inmateId: string, data: UpdateInmateStatusData) {
    const inmate = await Inmate.find(inmateId)

    if (!inmate) {
      const error = new Error('Inmate não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    // Desativar todos os status ativos anteriores
    await InmateStatus.query()
      .where('inmate_id', inmateId)
      .where('active', true)
      .update({ active: false })

    // Criar novo status ativo
    const newStatus = await InmateStatus.create({
      inmateId: inmateId,
      adminId: data.adminId || null,
      status: data.status,
      active: true,
      notes: data.notes || null,
    })

    await newStatus.load('inmate')
    if (newStatus.adminId) {
      await newStatus.load('admin')
    }

    return newStatus
  }
}

