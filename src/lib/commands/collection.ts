import { parsePageArgs } from '@/lib/paginate';
import { fail, ok } from '@/lib/commands/helpers';
import { runSubcommands } from '@/lib/commands/subcommands';
import type { CommandResult } from '@/lib/commands/types';

type ListFn = (
	page: number,
) => { lines: string[]; page: number } | Promise<{ lines: string[]; page: number }>;
type GetFn = (id: string) => string[] | null | Promise<string[] | null>;
type GetLatestFn = () => string[] | Promise<string[]>;

/** Last list page per collection — used by `list page next|prev`. */
const listPageState = new Map<string, number>();

export async function collectionCommand(
	name: string,
	args: string[],
	handlers: {
		list: ListFn;
		get: GetFn;
		getLatest?: GetLatestFn;
	},
): Promise<CommandResult> {
	return runSubcommands(
		name,
		args,
		{
			list: async (rest) => {
				const current = listPageState.get(name) ?? 1;
				const parsed = parsePageArgs(rest, current);

				if (parsed.rest.length > 0) {
					return fail(
						`Unexpected arguments: ${parsed.rest.join(' ')}`,
						`Usage: ${name} list [page <n|next|prev>]`,
					);
				}

				const { lines, page } = await handlers.list(parsed.page);
				listPageState.set(name, page);
				return ok(lines, 'top');
			},

			get: async (rest) => {
				const id = rest.join(' ').trim();

				if (!id) {
					let hint = `Try: ${name} list`;

					if (handlers.getLatest) {
						hint = `Also: ${name} get latest`;
					}

					return fail(`Usage: ${name} get <id>`, hint);
				}

				if (handlers.getLatest && id.toLowerCase() === 'latest') {
					return ok(await handlers.getLatest(), 'top');
				}

				const lines = await handlers.get(id);

				if (!lines) {
					return fail(`${name} item not found: ${id}`, `Try: ${name} list`);
				}

				return ok(lines, 'top');
			},
		},
		{ defaultSub: 'list' },
	);
}
