import { Id } from './_generated/dataModel';
import { mutation } from './_generated/server';

export default mutation(
  async ({ db }, presenceId: Id<'presence'>, data: any) => {
    await db.patch(presenceId, { data, updated: Date.now() });
  }
);
