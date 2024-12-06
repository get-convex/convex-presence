import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  presence: defineTable({
    user: v.string(),
    room: v.string(),
    present: v.boolean(),
    latestJoin: v.number(),
    data: v.any(),
  })
    .index('room_present_join', ['room', 'present', 'latestJoin'])
    .index('room_user', ['room', 'user']),

  presence_heartbeats: defineTable({
    user: v.string(),
    room: v.string(),
    markAsGone: v.id('_scheduled_functions'),
  }).index('by_room_user', ['room', 'user']),
});
