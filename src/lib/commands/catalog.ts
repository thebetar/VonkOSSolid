export type CommandKind = 'page' | 'collection' | 'custom';

export interface CommandCatalogEntry {
	name: string;
	aliases: string[];
	/** URL path segment; defaults to `name`. */
	path?: string;
	kind: CommandKind;
}

export const COMMAND_CATALOG = [
	{ name: 'help', aliases: ['h', '?'], kind: 'page' },
	{ name: 'about', aliases: ['a'], kind: 'page' },
	{ name: 'contact', aliases: ['c'], kind: 'page' },
	{ name: 'subscribe', aliases: ['sub'], kind: 'page' },
	{ name: 'cookies', aliases: ['cookie'], kind: 'page' },
	{ name: 'blog', aliases: ['blogs', 'b'], path: 'blogs', kind: 'collection' },
	{ name: 'experience', aliases: ['experiences', 'ex'], kind: 'collection' },
	{ name: 'projects', aliases: ['project', 'p'], kind: 'collection' },
	{ name: 'education', aliases: ['ed'], kind: 'collection' },
	{ name: 'skills', aliases: ['skill', 'sk'], kind: 'custom' },
	{ name: 'scripts', aliases: ['script', 'sc'], path: 'script', kind: 'custom' },
	{ name: 'resume', aliases: ['r'], kind: 'custom' },
] as const satisfies readonly CommandCatalogEntry[];

export type CommandName = (typeof COMMAND_CATALOG)[number]['name'];

export type CatalogEntry = (typeof COMMAND_CATALOG)[number];

export function findCatalogEntry(query: string): CatalogEntry | undefined {
	const q = query.toLowerCase();

	return COMMAND_CATALOG.find((entry) => {
		if (entry.name === q) {
			return true;
		}

		return (entry.aliases as readonly string[]).includes(q);
	});
}

export function catalogPath(entry: CatalogEntry): string {
	if ('path' in entry && entry.path) {
		return entry.path;
	}

	return entry.name;
}
