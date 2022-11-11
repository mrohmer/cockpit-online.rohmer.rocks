import Dexie from 'dexie';
import type { Session } from '$lib/models/session';
import type {Settings} from '../models/settings';

export class ProjectDb extends Dexie {
	sessions!: Dexie.Table<Session>;
	settings!: Dexie.Table<Settings>;

	constructor() {
		super('sessions');
		this.version(2).stores({
			sessions: '++id, name',
			settings: '&key',
		});
	}

	async getSettingsObj(): Promise<Record<Settings['key'], Settings['value']>> {
		const items = await this.settings.toArray();
		return items.reduce(
			(prev, {key, value}) => ({
				...prev,
				[key]: value,
			}),
			{} as Record<Settings['key'], Settings['value']>,
		)
	}
}

export const db = new ProjectDb();
