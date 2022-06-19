import {db} from '$lib/db';

export const addSession = (name: string) => db.transaction('rw', db.sessions, async () => {
  const sessions = await db.sessions.where({name}).toArray();
  if (sessions.length) {
    return;
  }

  await db.sessions.add({name});
})
export const removeSession = async (name: string) => db.transaction('rw', db.sessions, async () => {
  const sessions = await db.sessions.where({name}).toArray();
  if (!sessions.length) {
    return;
  }

  await Promise.all(sessions.map(session => db.sessions.delete(session.id)));
})
