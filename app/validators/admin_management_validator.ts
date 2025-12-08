import vine from '@vinejs/vine'

/**
 * Validator para criação de administrador (com accessLevel)
 */
export const adminCreateValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).confirmed(),
    fullName: vine.string().trim().minLength(3).optional(),
    accessLevel: vine.number().min(1).max(5),
    cargo: vine.string().trim().optional(),
  })
)

/**
 * Validator para atualização de administrador
 */
export const adminUpdateValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail().optional(),
    password: vine.string().minLength(8).confirmed().optional(),
    fullName: vine.string().trim().minLength(3).optional(),
    accessLevel: vine.number().min(1).max(5).optional(),
    cargo: vine.string().trim().optional(),
  })
)

