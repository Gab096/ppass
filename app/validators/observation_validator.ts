import vine from '@vinejs/vine'

/**
 * Validator para criação de observação de detento
 */
export const createInmateObservationValidator = vine.compile(
  vine.object({
    inmateId: vine.number().optional(),
    inmateVisitId: vine.number().optional(),
    title: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(5),
    observationType: vine.enum(['medical', 'behavioral', 'disciplinary', 'general']).optional(),
    observedBy: vine.string().trim().optional(),
  })
)

/**
 * Validator para atualização de observação de detento
 */
export const updateInmateObservationValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    description: vine.string().trim().minLength(5).optional(),
    observationType: vine.enum(['medical', 'behavioral', 'disciplinary', 'general']).optional(),
    observedBy: vine.string().trim().optional(),
  })
)

/**
 * Validator para criação de observação de visitante
 */
export const createVisitorObservationValidator = vine.compile(
  vine.object({
    visitorId: vine.number().optional(),
    visitorVisitId: vine.number().optional(),
    title: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(5),
    observationType: vine.enum(['behavioral', 'suspicious', 'compliant', 'general']).optional(),
    observedBy: vine.string().trim().optional(),
  })
)

/**
 * Validator para atualização de observação de visitante
 */
export const updateVisitorObservationValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    description: vine.string().trim().minLength(5).optional(),
    observationType: vine.enum(['behavioral', 'suspicious', 'compliant', 'general']).optional(),
    observedBy: vine.string().trim().optional(),
  })
)

