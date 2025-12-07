import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Visitor from './visitor.js'
import Admin from './admin.js'

export default class VisitorStatus extends BaseModel {
  static readonly table = 'visitor_statuses'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare visitorId: number

  @column()
  declare adminId: number | null

  @column()
  declare status: 'liberado' | 'bloqueado' | 'atenção'

  @column()
  declare active: boolean

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Visitor)
  declare visitor: BelongsTo<typeof Visitor>

  @belongsTo(() => Admin)
  declare admin: BelongsTo<typeof Admin> | null
}

