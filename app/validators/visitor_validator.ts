import vine from '@vinejs/vine'

/**
 * Validator para criação de visitante
 */
export const createVisitorValidator = vine.compile(
  vine.object({
    inmateId: vine.string().uuid(),
    fullName: vine.string().trim().minLength(3),
    documentNumber: vine.string().trim().optional(),
    barcode: vine.string().trim().optional(),
    isAffiliatedToCriminalOrganization: vine.boolean().optional(),
    criminalOrganizationName: vine.string().trim().optional(),
    relationship: vine.string().trim().optional(),
    notes: vine.string().trim().optional(),
  })
)

/**
 * Validator para atualização de visitante
 */
export const updateVisitorValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).optional(),
    documentNumber: vine.string().trim().optional(),
    barcode: vine.string().trim().optional(),
    isAffiliatedToCriminalOrganization: vine.boolean().optional(),
    criminalOrganizationName: vine.string().trim().optional(),
    relationship: vine.string().trim().optional(),
    notes: vine.string().trim().optional(),
  })
)

