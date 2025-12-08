import InmateObservation from '#models/inmate_observation'
import Inmate from '#models/inmate'

type CreateInmateObservationData = {
  inmateId: string
  inmateVisitId?: string | null
  title: string
  description: string
  observationType?: 'medical' | 'behavioral' | 'disciplinary' | 'general'
  observedBy?: string | null
}

export default class CreateInmateObservationUseCase {
  async execute(data: CreateInmateObservationData) {
    const inmate = await Inmate.find(data.inmateId)

    if (!inmate) {
      const error = new Error('Inmate não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
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
