import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Visitor from './visitor.js'
import VisitorObservation from './visitor_observation.js'

export default class VisitorVisit extends BaseModel {
  static readonly table = 'visitor_visits'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare visitorId: string

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

  @belongsTo(() => Visitor)
  declare visitor: BelongsTo<typeof Visitor>

  @hasMany(() => VisitorObservation)
  declare observations: HasMany<typeof VisitorObservation>
}

