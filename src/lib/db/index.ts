import Dexie from 'dexie';
import type { Session } from '$lib/models/session';
import type {RemainingGasSubscription} from '../models/remaining-gas-subscription';

export class ProjectDb extends Dexie {
	sessions!: Dexie.Table<Session>;

	remainingGasSubscriptions!: Dexie.Table<RemainingGasSubscription>;

	constructor() {
		super('sessions');
		this.version(2).stores({
			sessions: '++id, name',
			remainingGasSubscriptions: '++id, sessionName, slotId',
		});
	}
}

export const db = new ProjectDb();
