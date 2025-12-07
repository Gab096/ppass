import Inmate from '#models/inmate'
import { DateTime } from 'luxon'

type UpdateInmateData = {
  fullName?: string
  registrationNumber?: string
  profilePhoto?: string | null
  isAffiliatedToCriminalOrganization?: boolean
  criminalOrganizationName?: string | null
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
      const error = new Error('Inmate não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    if (data.fullName) inmate.fullName = data.fullName
    if (data.registrationNumber) inmate.registrationNumber = data.registrationNumber
    if (data.profilePhoto !== undefined) inmate.profilePhoto = data.profilePhoto || null
    if (data.isAffiliatedToCriminalOrganization !== undefined)
      inmate.isAffiliatedToCriminalOrganization = data.isAffiliatedToCriminalOrganization
    if (data.criminalOrganizationName !== undefined)
      inmate.criminalOrganizationName = data.criminalOrganizationName || null
    if (data.dateOfBirth !== undefined)
      inmate.dateOfBirth = data.dateOfBirth ? DateTime.fromISO(data.dateOfBirth) : null
    if (data.gender !== undefined) inmate.gender = data.gender || null
    if (data.cellNumber !== undefined) inmate.cellNumber = data.cellNumber || null
    if (data.status) inmate.status = data.status
    if (data.admissionDate) inmate.admissionDate = DateTime.fromISO(data.admissionDate)
    if (data.releaseDate !== undefined)
      inmate.releaseDate = data.releaseDate ? DateTime.fromISO(data.releaseDate) : null

    await inmate.save()
    await inmate.load('observations')
    await inmate.load('visitors')

    return inmate
  }
}
