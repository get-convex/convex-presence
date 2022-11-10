import { defineSchema, defineTable, s } from 'convex/schema';

export default defineSchema({
  presence: defineTable({
    location: s.string(),
    updated: s.number(),
    data: s.object({}),
  }).index('by_event_updated', ['location', 'updated']),
});
