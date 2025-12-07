import Inmate from '#models/inmate'
import { DateTime } from 'luxon'

type CreateInmateData = {
  fullName: string
  registrationNumber: string
  barcode?: string | null
  profilePhoto?: string | null
  isAffiliatedToCriminalOrganization?: boolean
  criminalOrganizationName?: string | null
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
      barcode: data.barcode || null,
      profilePhoto: data.profilePhoto || null,
      isAffiliatedToCriminalOrganization: data.isAffiliatedToCriminalOrganization || false,
      criminalOrganizationName: data.criminalOrganizationName || null,
      dateOfBirth: data.dateOfBirth ? DateTime.fromISO(data.dateOfBirth) : null,
      gender: data.gender || null,
      cellNumber: data.cellNumber || null,
      status: data.status || 'active',
      admissionDate: DateTime.fromISO(data.admissionDate),
      releaseDate: data.releaseDate ? DateTime.fromISO(data.releaseDate) : null,
    })

    await inmate.load('observations')
    await inmate.load('visitors')

    return inmate
  }
}
