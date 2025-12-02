import Visitor from '#models/visitor'
import Inmate from '#models/inmate'
import { errors } from '@adonisjs/core'

type CreateVisitorData = {
  inmateId: number
  fullName: string
  documentNumber?: string | null
  relationship?: string | null
  notes?: string | null
}

export default class CreateVisitorUseCase {
  async execute(data: CreateVisitorData) {
    const inmate = await Inmate.find(data.inmateId)

    if (!inmate) {
      throw new errors.E_ROW_NOT_FOUND('Inmate não encontrado')
    }

    const visitor = await Visitor.create({
      inmateId: data.inmateId,
      fullName: data.fullName,
      documentNumber: data.documentNumber || null,
      relationship: data.relationship || null,
      notes: data.notes || null,
    })

    await visitor.load('inmate')

    return visitor
  }
}

