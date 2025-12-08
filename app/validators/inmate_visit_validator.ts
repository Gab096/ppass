import vine from '@vinejs/vine'

/**
 * Validator para criação de visita de detento
 */
export const createInmateVisitValidator = vine.compile(
  vine.object({
    inmateId: vine.string().uuid().optional(),
    visitorName: vine.string().trim().minLength(3),
    visitorDocument: vine.string().trim().optional(),
    relationship: vine.string().trim().optional(),
    visitDate: vine.date(),
    visitDuration: vine.number().positive().optional(),
    visitType: vine.enum(['family', 'legal', 'medical', 'other']).optional(),
    status: vine.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
    notes: vine.string().trim().optional(),
    registeredBy: vine.string().trim().optional(),
  })
)

/**
 * Validator para atualização de visita de detento
 */
export const updateInmateVisitValidator = vine.compile(
  vine.object({
    visitorName: vine.string().trim().minLength(3).optional(),
    visitorDocument: vine.string().trim().optional(),
    relationship: vine.string().trim().optional(),
    visitDate: vine.date().optional(),
    visitDuration: vine.number().positive().optional(),
    visitType: vine.enum(['family', 'legal', 'medical', 'other']).optional(),
    status: vine.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
    notes: vine.string().trim().optional(),
    registeredBy: vine.string().trim().optional(),
  })
)

