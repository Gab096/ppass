import vine from '@vinejs/vine'

/**
 * Validator para criação de visita de visitante
 */
export const createVisitorVisitValidator = vine.compile(
  vine.object({
    visitorId: vine.string().uuid().optional(),
    visitDate: vine.date(),
    visitDuration: vine.number().positive().optional(),
    visitType: vine.enum(['family', 'legal', 'medical', 'other']).optional(),
    status: vine.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
    notes: vine.string().trim().optional(),
    registeredBy: vine.string().trim().optional(),
  })
)

/**
 * Validator para atualização de visita de visitante
 */
export const updateVisitorVisitValidator = vine.compile(
  vine.object({
    visitDate: vine.date().optional(),
    visitDuration: vine.number().positive().optional(),
    visitType: vine.enum(['family', 'legal', 'medical', 'other']).optional(),
    status: vine.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
    notes: vine.string().trim().optional(),
    registeredBy: vine.string().trim().optional(),
  })
)

