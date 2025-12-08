import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Inmate from './inmate.js'
import Admin from './admin.js'

export default class InmateStatus extends BaseModel {
  static readonly table = 'inmate_statuses'
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare inmateId: string

  @column()
  declare adminId: string | null

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

  @belongsTo(() => Inmate)
  declare inmate: BelongsTo<typeof Inmate>

  @belongsTo(() => Admin)
  declare admin: BelongsTo<typeof Admin> | null
}

