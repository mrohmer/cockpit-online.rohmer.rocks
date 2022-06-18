import Dexie from 'dexie';
import type { Session } from '$lib/models/session';

export class ProjectDb extends Dexie {
	sessions!: Dexie.Table<Session>;

	constructor() {
		super('sessions');
		this.version(1).stores({
			sessions: '++id, name',
		});
	}
}

export const db = new ProjectDb();
