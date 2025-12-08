import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import InmateObservation from './inmate_observation.js'
import InmateVisit from './inmate_visit.js'
import InmateStatus from './inmate_status.js'
import Visitor from './visitor.js'

export default class Inmate extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fullName: string

  @column()
  declare registrationNumber: string

  @column()
  declare barcode: string | null

  @column()
  declare profilePhoto: string | null

  @column()
  declare isAffiliatedToCriminalOrganization: boolean

  @column()
  declare criminalOrganizationName: string | null

  @column.date()
  declare dateOfBirth: DateTime | null

  @column()
  declare gender: string | null

  @column()
  declare cellNumber: string | null

  @column()
  declare status: 'active' | 'released' | 'transferred'

  @column.date()
  declare admissionDate: DateTime

  @column.date()
  declare releaseDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => InmateObservation)
  declare observations: HasMany<typeof InmateObservation>

  @hasMany(() => InmateVisit)
  declare visits: HasMany<typeof InmateVisit>

  @hasMany(() => Visitor)
  declare visitors: HasMany<typeof Visitor>

  @hasMany(() => InmateStatus)
  declare statuses: HasMany<typeof InmateStatus>
}

