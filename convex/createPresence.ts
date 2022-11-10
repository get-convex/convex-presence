import { mutation } from './_generated/server';

export default mutation(async ({ db }, location: string, data: {}) => {
  return await db.insert('presence', {
    data,
    location,
    updated: Date.now(),
  });
});
