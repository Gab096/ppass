import vine from '@vinejs/vine'

/**
 * Validator para listagem de check-ins/check-outs (paginação)
 */
export const listVisitorCheckinsValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(200).optional(),
  })
)

/**
 * Validator para criação de check-in/check-out
 */
export const createVisitorCheckinValidator = vine.compile(
  vine.object({
    check_type: vine.enum(['in', 'out']),
    notes: vine.string().trim().maxLength(1000).optional(),
    observation_title: vine.string().trim().minLength(3).maxLength(255).optional(),
    observation_description: vine.string().trim().minLength(5).maxLength(2000).optional(),
  })
)
