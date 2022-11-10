import { defineSchema, defineTable, s } from 'convex/schema'

export default defineSchema({
  events: defineTable({}),
  presence: defineTable({
    name: s.string(),
    eventId: s.id('events'),
    updated: s.number(),
    data: s.object({}),
  }).index('by_event_updated', ['eventId', 'updated']),
})
