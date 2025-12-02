import InmateObservation from '#models/inmate_observation'
import Inmate from '#models/inmate'
import { errors } from '@adonisjs/core'

type CreateInmateObservationData = {
  inmateId: number
  inmateVisitId?: number | null
  title: string
  description: string
  observationType?: 'medical' | 'behavioral' | 'disciplinary' | 'general'
  observedBy?: string | null
}

export default class CreateInmateObservationUseCase {
  async execute(data: CreateInmateObservationData) {
    const inmate = await Inmate.find(data.inmateId)

    if (!inmate) {
      throw new errors.E_ROW_NOT_FOUND('Inmate não encontrado')
    }

    const observation = await InmateObservation.create({
      inmateId: data.inmateId,
      inmateVisitId: data.inmateVisitId || null,
      title: data.title,
      description: data.description,
      observationType: data.observationType || 'general',
      observedBy: data.observedBy || null,
    })

    await observation.load('inmate')
    if (data.inmateVisitId) {
      await observation.load('visit')
    }

    return observation
  }
}

