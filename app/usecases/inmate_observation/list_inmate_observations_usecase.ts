import InmateObservation from '#models/inmate_observation'

export default class ListInmateObservationsUseCase {
  async execute(inmateId?: number, page: number = 1, limit: number = 10) {
    const query = InmateObservation.query().preload('inmate').orderBy('created_at', 'desc')

    if (inmateId) {
      query.where('inmate_id', inmateId)
    }

    const observations = await query.paginate(page, limit)

    return observations
  }
}

