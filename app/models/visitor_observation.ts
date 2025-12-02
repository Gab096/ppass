import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Visitor from './visitor.js'
import VisitorVisit from './visitor_visit.js'

export default class VisitorObservation extends BaseModel {
  static readonly table = 'visitor_observations'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare visitorId: number

  @column()
  declare visitorVisitId: number | null

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare observationType: 'behavioral' | 'suspicious' | 'compliant' | 'general'

  @column()
  declare observedBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Visitor)
  declare visitor: BelongsTo<typeof Visitor>

  @belongsTo(() => VisitorVisit)
  declare visit: BelongsTo<typeof VisitorVisit> | null
}

