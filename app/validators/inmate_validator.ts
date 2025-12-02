import vine from '@vinejs/vine'

/**
 * Validator para criação de detento
 */
export const createInmateValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    registrationNumber: vine.string().trim().minLength(1),
    dateOfBirth: vine.date().optional(),
    gender: vine.string().trim().optional(),
    cellNumber: vine.string().trim().optional(),
    status: vine.enum(['active', 'released', 'transferred']).optional(),
    admissionDate: vine.date(),
    releaseDate: vine.date().optional(),
  })
)

/**
 * Validator para atualização de detento
 */
export const updateInmateValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).optional(),
    registrationNumber: vine.string().trim().minLength(1).optional(),
    dateOfBirth: vine.date().optional(),
    gender: vine.string().trim().optional(),
    cellNumber: vine.string().trim().optional(),
    status: vine.enum(['active', 'released', 'transferred']).optional(),
    admissionDate: vine.date().optional(),
    releaseDate: vine.date().optional(),
  })
)

