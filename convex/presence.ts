import { Id } from './_generated/dataModel';
import { query, mutation } from './_generated/server';

export const getOrCreate = mutation(
  async ({ db }, user: string, location: string, data: any) => {
    const existing = await db
      .query('presence')
      .withIndex('by_user_location', (q) =>
        q.eq('user', user).eq('location', location)
      )
      .unique();
    if (existing) {
      return existing._id;
    }
    return await db.insert('presence', {
      user,
      data,
      location,
      updated: Date.now(),
    });
  }
);

export const update = mutation(
  async ({ db }, presenceId: Id<'presence'>, data: any) => {
    await db.patch(presenceId, { data, updated: Date.now() });
  }
);

export const list = query(
  async ({ db }, location: string, exclude: Id<'presence'> | null) => {
    if (!exclude) {
      return [];
    }
    const presence = await db
      .query('presence')
      .withIndex('by_location_updated', (q) => q.eq('location', location))
      .order('desc')
      .filter((q) => q.neq(q.field('_id'), exclude))
      .take(20);
    return presence.map(({ _creationTime, updated, data }) => ({
      created: _creationTime,
      updated,
      data,
    }));
  }
);
