import Dexie from 'dexie';
import type { Session } from '$lib/models/session';
import type {RemainingGasSubscription} from '../models/remaining-gas-subscription';
import ms from 'ms';
import {remainingGasSubscription} from './remaining-gas-subscription';

export class ProjectDb extends Dexie {
	sessions!: Dexie.Table<Session>;

	remainingGasSubscriptions!: Dexie.Table<RemainingGasSubscription>;

	readonly utils = {
		remainingGasSubscription,
	}

	constructor() {
		super('sessions');
		this.version(3).stores({
			sessions: '++id, name',
			remainingGasSubscriptions: '++id, sessionName, slotId, created',
		});
		this.on('ready', () => this.deleteSubscriptionsAfterTTL());
	}

	private async deleteSubscriptionsAfterTTL() {
		await this.remainingGasSubscriptions
			.where('created')
			.below(new Date(+new Date() - ms('1 day')))
			.delete();
	}
}

export const db = new ProjectDb();
