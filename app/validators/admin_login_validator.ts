import vine from '@vinejs/vine'

/**
 * Validator para login de administrador
 */
export const adminLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(6),
  })
)

