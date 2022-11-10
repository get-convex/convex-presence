import { Id } from './_generated/dataModel';
import { query } from './_generated/server';

export default query(async ({ db }, location: string) => {
  const presence = await db
    .query('presence')
    .withIndex('by_event_updated', (q) => q.eq('location', location))
    .order('desc')
    .collect();
  return presence.map(
    ({ _id, updated, data }) =>
      ({
        _id,
        updated,
        data,
      } as { _id: Id<'presence'>; updated: number; data: any })
  );
});
