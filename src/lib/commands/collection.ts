import { parsePageArgs } from '@/lib/paginate';
import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { fail, getSubcommand, ok } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

type ListFn = (page: number) => { lines: string[]; page: number } | Promise<{ lines: string[]; page: number }>;
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
	if (args.length === 0 || isHelpArg(args[0])) {
		return commandHelpResult(name);
	}

	const { sub, rest } = getSubcommand(args, 'list');

	if (sub === 'list') {
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
	}

	if (sub === 'get') {
		const id = rest.join(' ').trim();

		if (!id) {
			let hint = `Try: ${name} list`;
			if (handlers.getLatest) {
				hint = `Also: ${name} get latest`;
			}

			return fail(`Usage: ${name} get <id>`, hint);
		}

		if (handlers.getLatest) {
			if (id.toLowerCase() === 'latest') {
				return ok(await handlers.getLatest(), 'top');
			}
		}

		const lines = await handlers.get(id);
		if (!lines) {
			return fail(`${name} item not found: ${id}`, `Try: ${name} list`);
		}

		return ok(lines, 'top');
	}

	return fail(
		`Unknown ${name} command: ${sub}`,
		`Try: ${name} help`,
	);
}
