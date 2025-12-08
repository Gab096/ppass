import Visitor from '#models/visitor'
import Inmate from '#models/inmate'

type CreateVisitorData = {
  inmateId: string
  fullName: string
  documentNumber?: string | null
  barcode?: string | null
  profilePhoto?: string | null
  isAffiliatedToCriminalOrganization?: boolean
  criminalOrganizationName?: string | null
  relationship?: string | null
  notes?: string | null
}

export default class CreateVisitorUseCase {
  async execute(data: CreateVisitorData) {
    const inmate = await Inmate.find(data.inmateId)

    if (!inmate) {
      const error = new Error('Inmate não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    const visitor = await Visitor.create({
      inmateId: data.inmateId,
      fullName: data.fullName,
      documentNumber: data.documentNumber || null,
      barcode: data.barcode || null,
      profilePhoto: data.profilePhoto || null,
      isAffiliatedToCriminalOrganization: data.isAffiliatedToCriminalOrganization || false,
      criminalOrganizationName: data.criminalOrganizationName || null,
      relationship: data.relationship || null,
      notes: data.notes || null,
    })

    await visitor.load('inmate')

    return visitor
  }
}
