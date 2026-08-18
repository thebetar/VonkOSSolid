import { error, muted } from '@/lib/ansi';
import type { CommandResult } from '@/lib/commands/types';

export function ok(lines: string[], scrollTo: 'top' | 'bottom' = 'top'): CommandResult {
	return { action: 'print', lines, scrollTo };
}

export function append(lines: string[]): CommandResult {
	return { action: 'append', lines, scrollTo: 'bottom' };
}

export function fail(message: string, hint?: string): CommandResult {
	const lines = [error(message)];

	if (hint) {
		lines.push(muted(hint));
	}

	return {
		action: 'print',
		lines,
		scrollTo: 'top',
	};
}

export function getSubcommand(
	args: string[],
	fallback: string,
): { sub: string; rest: string[] } {
	if (args.length === 0) {
		return {
			sub: fallback,
			rest: [],
		};
	}

	return {
		sub: args[0].toLowerCase(),
		rest: args.slice(1),
	};
}

export function stripFlags(
	args: string[],
	flags: string[],
): { kept: string[]; hasFlag: boolean } {
	const flagSet = new Set(flags.map((flag) => flag.toLowerCase()));
	const kept: string[] = [];
	let hasFlag = false;

	for (const part of args) {
		if (flagSet.has(part.toLowerCase())) {
			hasFlag = true;
			continue;
		}

		kept.push(part);
	}

	return { kept, hasFlag };
}
