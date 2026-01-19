import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Visitor from './visitor.js'
import VisitorObservation from './visitor_observation.js'
import Admin from './admin.js'

export default class VisitorCheckin extends BaseModel {
  static readonly table = 'visitor_checkins'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare visitorId: string

  @column()
  declare visitorObservationId: string | null

  @column()
  declare checkType: 'in' | 'out'

  @column()
  declare adminId: string | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Visitor)
  declare visitor: BelongsTo<typeof Visitor>

  @belongsTo(() => VisitorObservation)
  declare observation: BelongsTo<typeof VisitorObservation> | null

  @belongsTo(() => Admin)
  declare admin: BelongsTo<typeof Admin> | null
}
