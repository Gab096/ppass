import vine from '@vinejs/vine'

/**
 * Validator para criação de administrador
 */
export const adminCreateValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).confirmed(),
    fullName: vine.string().trim().minLength(3).optional(),
  })
)

