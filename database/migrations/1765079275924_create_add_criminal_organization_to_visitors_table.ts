import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_affiliated_to_criminal_organization').defaultTo(false).after('profile_photo')
      table.string('criminal_organization_name').nullable().after('is_affiliated_to_criminal_organization')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_affiliated_to_criminal_organization')
      table.dropColumn('criminal_organization_name')
    })
  }
}