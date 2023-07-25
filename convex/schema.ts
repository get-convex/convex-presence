import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  presence_data: defineTable({
    user: v.string(),
    room: v.string(),
    present: v.boolean(),
    latestJoin: v.number(),
    data: v.any(),
  }).index('by_room_present', ['room', 'present', 'user']),

  presence_heartbeats: defineTable({
    user: v.string(),
    room: v.string(),
    updated: v.number(),
  }).index('by_room_user', ['room', 'user']),
});
