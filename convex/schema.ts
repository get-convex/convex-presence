import { defineSchema, defineTable, s } from 'convex/schema';

export default defineSchema({
  presence: defineTable({
    user: s.string(),
    location: s.string(),
    updated: s.number(),
    data: s.any(),
  })
    .index('by_location_updated', ['location', 'updated'])
    .index('by_user_location', ['user', 'location']),
});
