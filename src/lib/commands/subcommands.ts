import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { fail, getSubcommand } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

type SubcommandHandler = (
	rest: string[],
) => CommandResult | Promise<CommandResult>;

export async function runSubcommands(
	name: string,
	args: string[],
	handlers: Record<string, SubcommandHandler>,
	options?: {
		defaultSub?: string;
		helpOnEmpty?: boolean;
	},
): Promise<CommandResult> {
	const helpOnEmpty = options?.helpOnEmpty ?? true;
	const defaultSub = options?.defaultSub ?? 'help';

	if (args.length === 0 && helpOnEmpty) {
		return commandHelpResult(name);
	}

	if (isHelpArg(args[0])) {
		return commandHelpResult(name);
	}

	const { sub, rest } = getSubcommand(args, defaultSub);

	if (isHelpArg(sub)) {
		return commandHelpResult(name);
	}

	const handler = handlers[sub];

	if (!handler) {
		return fail(
			`Unknown ${name} command: ${sub}`,
			`Try: ${name} help`,
		);
	}

	return handler(rest);
}
