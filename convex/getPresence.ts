import { GenericId } from 'convex/values'
import { Id } from './_generated/dataModel'
import { query } from './_generated/server'

export default query(async ({ db }, eventId: Id<'events'>) => {
  const presence = await db
    .query('presence')
    .withIndex('by_event_updated', (q) => q.eq('eventId', eventId))
    .order('desc')
    .collect()
  return presence.map(({ _id, name, updated, data }) => ({
    _id,
    name,
    updated,
    data,
  }))
})
