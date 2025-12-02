import Inmate from '#models/inmate'
import { errors } from '@adonisjs/core'

type UpdateInmateData = {
  fullName?: string
  registrationNumber?: string
  dateOfBirth?: string | null
  gender?: string | null
  cellNumber?: string | null
  status?: 'active' | 'released' | 'transferred'
  admissionDate?: string
  releaseDate?: string | null
}

export default class UpdateInmateUseCase {
  async execute(id: number, data: UpdateInmateData) {
    const inmate = await Inmate.find(id)

    if (!inmate) {
      throw new errors.E_ROW_NOT_FOUND('Inmate não encontrado')
    }

    if (data.fullName) inmate.fullName = data.fullName
    if (data.registrationNumber) inmate.registrationNumber = data.registrationNumber
    if (data.dateOfBirth !== undefined) inmate.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null
    if (data.gender !== undefined) inmate.gender = data.gender || null
    if (data.cellNumber !== undefined) inmate.cellNumber = data.cellNumber || null
    if (data.status) inmate.status = data.status
    if (data.admissionDate) inmate.admissionDate = new Date(data.admissionDate)
    if (data.releaseDate !== undefined) inmate.releaseDate = data.releaseDate ? new Date(data.releaseDate) : null

    await inmate.save()
    await inmate.load('observations')
    await inmate.load('visitors')

    return inmate
  }
}

