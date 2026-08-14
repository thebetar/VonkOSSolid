import {
	COMMAND_HELP,
	findCommandHelp,
	type CommandHelpEntry,
	type CommandUsage,
} from '@/data/command-help';
import { accent, color, getWrapWidth, heading, muted, wrapText } from '@/lib/ansi';
import { fail, ok } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

export function isHelpArg(value: string | undefined): boolean {
	if (!value) {
		return false;
	}

	const normalized = value.toLowerCase();
	return (
		normalized === 'help' ||
		normalized === '-h' ||
		normalized === '--help' ||
		normalized === '?'
	);
}

/** Help row: yellow command, magenta `(alias)`, then args. */
export function formatHelpRow(
	command: string,
	alias: string,
	args: string,
	description: string,
): string[] {
	const aliasText = alias ? `(${alias})` : '';
	const argsPart = args ? `  ${args}` : '';
	const visible = alias
		? `${command} ${aliasText}${argsPart}`
		: `${command}${argsPart}`;
	const width = getWrapWidth();
	const commandLine = alias
		? `  ${color.yellow(command)} ${color.magenta(aliasText)}${argsPart}`
		: `  ${color.yellow(command)}${argsPart}`;

	if (width < 56 || visible.length + 4 + description.length > width) {
		return [commandLine, muted(`    ${description}`)];
	}

	const pad = ' '.repeat(Math.max(2, 56 - visible.length));
	return [`${commandLine}${pad}${muted(description)}`];
}

export function commandSummaryLines(): string[] {
	return COMMAND_HELP.flatMap((entry) =>
		formatHelpRow(entry.name, entry.aliases[0] ?? '', '', entry.summary),
	);
}

/** Phone start screen: one line each, no subcommands. */
export const MOBILE_WELCOME_COMMANDS = [
	'blog',
	'experience',
	'education',
	'scripts',
] as const;

export function compactCommandLines(
	names: readonly string[] = MOBILE_WELCOME_COMMANDS,
): string[] {
	return names.flatMap((name) => {
		const entry = findCommandHelp(name);
		if (!entry) {
			return [];
		}

		const alias = entry.aliases[0];
		const aliasText = alias ? ` ${color.magenta(`(${alias})`)}` : '';
		return [`  ${color.yellow(entry.name)}${aliasText}`];
	});
}

function usageRows(name: string, rows: CommandUsage[]): string[] {
	return rows.flatMap((row) => formatHelpRow(name, '', row.args, row.description));
}

function renderCommandHelp(entry: CommandHelpEntry): string[] {
	const lines = [heading(`Help · ${entry.name}`)];

	if (entry.aliases.length > 0) {
		lines.push(muted(`Alias: ${entry.aliases.join(', ')}`));
	}

	lines.push(
		'',
		...wrapText(entry.about).map((line) => color.white(line)),
		'',
		color.brightCyan('Usage'),
		...usageRows(entry.name, entry.usage),
		...(entry.name === 'help'
			? []
			: formatHelpRow(entry.name, '', 'help', 'This message')),
	);

	if (entry.options && entry.options.length > 0) {
		lines.push('', color.brightCyan('Options'));
		for (const option of entry.options) {
			lines.push(
				...formatHelpRow(option.args, '', '', option.description),
			);
		}
	}

	if (entry.examples.length > 0) {
		lines.push('', color.brightCyan('Examples'));
		for (const example of entry.examples) {
			lines.push(`  ${accent(example)}`);
		}
	}

	if (entry.notes && entry.notes.length > 0) {
		lines.push('');
		for (const note of entry.notes) {
			lines.push(...wrapText(note).map((line) => muted(line)));
		}
	}

	lines.push('');
	return lines;
}

export function getCommandHelp(query: string): string[] | null {
	const entry = findCommandHelp(query);
	return entry ? renderCommandHelp(entry) : null;
}

export function commandHelpResult(query: string): CommandResult {
	const lines = getCommandHelp(query);
	if (!lines) {
		return fail(
			`Unknown command: ${query}`,
			'Type help for available commands.',
		);
	}

	return ok(lines);
}
