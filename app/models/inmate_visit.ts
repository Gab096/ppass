import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Inmate from './inmate.js'
import InmateObservation from './inmate_observation.js'

export default class InmateVisit extends BaseModel {
  static readonly table = 'inmate_visits'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inmateId: number

  @column()
  declare visitorName: string

  @column()
  declare visitorDocument: string | null

  @column()
  declare relationship: string | null

  @column.dateTime()
  declare visitDate: DateTime

  @column()
  declare visitDuration: number | null

  @column()
  declare visitType: 'family' | 'legal' | 'medical' | 'other'

  @column()
  declare status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

  @column()
  declare notes: string | null

  @column()
  declare registeredBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Inmate)
  declare inmate: BelongsTo<typeof Inmate>

  @hasMany(() => InmateObservation)
  declare observations: HasMany<typeof InmateObservation>
}

