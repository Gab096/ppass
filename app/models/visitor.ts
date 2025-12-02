import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Inmate from './inmate.js'
import VisitorObservation from './visitor_observation.js'
import VisitorVisit from './visitor_visit.js'

export default class Visitor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inmateId: number

  @column()
  declare fullName: string

  @column()
  declare documentNumber: string | null

  @column()
  declare relationship: string | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Inmate)
  declare inmate: BelongsTo<typeof Inmate>

  @hasMany(() => VisitorObservation)
  declare observations: HasMany<typeof VisitorObservation>

  @hasMany(() => VisitorVisit)
  declare visits: HasMany<typeof VisitorVisit>
}

