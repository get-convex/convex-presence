import { Id } from './_generated/dataModel'
import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, name: string, eventId: Id<'events'>, data: {}) => {
    return await db.insert('presence', {
      name,
      data,
      eventId,
      updated: Date.now(),
    })
  }
)
