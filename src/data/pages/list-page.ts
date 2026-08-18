import { heading, muted, wrapText } from '@/lib/ansi';
import { paginate, paginationFooter } from '@/lib/paginate';

export function collectionListPage<T extends { id: string }>(options: {
	title: string;
	command: string;
	items: T[];
	page: number;
	renderItem: (item: T, idWidth: number) => string[];
}): { lines: string[]; page: number } {
	const { title, command, items, page, renderItem } = options;
	const slice = paginate(items, page);
	const longestId = Math.max(0, ...slice.items.map((item) => item.id.length));

	const lines: string[] = [
		heading(title),
		...wrapText(
			`Newest first. Use: ${command} get <id>  |  ${command} list page <n|next|prev>`,
		).map((line) => muted(line)),
		'',
	];

	for (const item of slice.items) {
		lines.push(...renderItem(item, longestId));
		lines.push('');
	}

	lines.push(...paginationFooter(slice, `${command} list`));

	return {
		lines,
		page: slice.page,
	};
}

export function findEntry<T>(
	items: T[],
	query: string,
	getKeys: (item: T) => string[],
	options?: { includes?: boolean },
): T | undefined {
	const q = query.trim().toLowerCase();

	for (const item of items) {
		const keys = getKeys(item).map((key) => key.toLowerCase());

		if (keys.includes(q)) {
			return item;
		}
	}

	if (!options?.includes) {
		return undefined;
	}

	for (const item of items) {
		const keys = getKeys(item).map((key) => key.toLowerCase());

		if (keys.some((key) => key.includes(q))) {
			return item;
		}
	}

	return undefined;
}
