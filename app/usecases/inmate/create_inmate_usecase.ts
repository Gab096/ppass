import Inmate from '#models/inmate'

type CreateInmateData = {
  fullName: string
  registrationNumber: string
  dateOfBirth?: string | null
  gender?: string | null
  cellNumber?: string | null
  status?: 'active' | 'released' | 'transferred'
  admissionDate: string
  releaseDate?: string | null
}

export default class CreateInmateUseCase {
  async execute(data: CreateInmateData) {
    const inmate = await Inmate.create({
      fullName: data.fullName,
      registrationNumber: data.registrationNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender || null,
      cellNumber: data.cellNumber || null,
      status: data.status || 'active',
      admissionDate: new Date(data.admissionDate),
      releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
    })

    await inmate.load('observations')
    await inmate.load('visitors')

    return inmate
  }
}

