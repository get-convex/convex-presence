import { mutation } from './_generated/server';

export default mutation(async ({ db }, location: string, data: any) => {
  return await db.insert('presence', {
    data,
    location,
    updated: Date.now(),
  });
});
