import { query, mutation } from './_generated/server';

export const update = mutation(
  async (
    { db },
    location: string,
    user: string,
    data: any,
    ifEmpty = false
  ) => {
    const existing = await db
      .query('presence')
      .withIndex('by_user_location', (q) =>
        q.eq('user', user).eq('location', location)
      )
      .unique();
    if (existing) {
      if (!ifEmpty) {
        await db.patch(existing._id, { data, updated: Date.now() });
      }
    } else {
      await db.insert('presence', {
        user,
        data,
        location,
        updated: Date.now(),
      });
    }
  }
);

export const list = query(async ({ db }, location: string, exclude: string) => {
  if (!exclude) {
    return [];
  }
  const presence = await db
    .query('presence')
    .withIndex('by_location_updated', (q) => q.eq('location', location))
    .order('desc')
    .filter((q) => q.neq(q.field('user'), exclude))
    .take(20);
  return presence.map(({ _creationTime, updated, data }) => ({
    created: _creationTime,
    updated,
    data,
  }));
});
