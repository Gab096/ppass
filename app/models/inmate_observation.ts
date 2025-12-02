import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Inmate from './inmate.js'
import InmateVisit from './inmate_visit.js'

export default class InmateObservation extends BaseModel {
  static readonly table = 'inmate_observations'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inmateId: number

  @column()
  declare inmateVisitId: number | null

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare observationType: 'medical' | 'behavioral' | 'disciplinary' | 'general'

  @column()
  declare observedBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Inmate)
  declare inmate: BelongsTo<typeof Inmate>

  @belongsTo(() => InmateVisit)
  declare visit: BelongsTo<typeof InmateVisit> | null
}

