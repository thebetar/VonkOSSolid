import { color, error, heading, muted } from '@/lib/ansi';
import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { append, fail, getSubcommand, ok } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

const namedScripts = new Map<string, string>();

interface ReplState {
	lines: string[];
	name: string | null;
}

let repl: ReplState | null = null;

export function isScriptsReplActive(): boolean {
	return repl !== null;
}

export function exitScriptsRepl(): void {
	repl = null;
}

function formatValue(value: unknown): string {
	if (value === undefined) {
		return 'undefined';
	}

	if (typeof value === 'string') {
		return JSON.stringify(value);
	}

	if (typeof value === 'function') {
		return '[Function]';
	}

	try {
		const json = JSON.stringify(value);
		return json === undefined ? String(value) : json;
	} catch {
		return String(value);
	}
}

function formatLogArgs(args: unknown[]): string {
	return args
		.map((arg) => (typeof arg === 'string' ? arg : formatValue(arg)))
		.join(' ');
}

function replBanner(name: string | null, loaded: string[]): string[] {
	const lines = [
		heading('Scripts'),
		'',
		muted('Leave with .exit or Ctrl+C'),
	];

	if (name) {
		lines.push(muted(`Script: ${name}`));
	}

	if (loaded.length > 0) {
		lines.push('', muted('Loaded:'));
		for (const line of loaded) {
			lines.push(muted(`  ${line}`));
		}
	}

	lines.push('');
	return lines;
}

function startRepl(name: string | null, initial: string[]): CommandResult {
	repl = { name, lines: [...initial] };
	return ok(replBanner(name, initial), 'bottom');
}

export function evalScriptsLine(line: string): CommandResult {
	if (!repl) {
		return fail('Scripts is not active');
	}

	const trimmed = line.trim();
	if (trimmed === '.exit' || trimmed === 'exit') {
		exitScriptsRepl();
		return commandHelpResult('scripts');
	}

	if (!trimmed) {
		return append([]);
	}

	repl.lines.push(line);

	const logs: string[] = [];
	const nativeLog = console.log;
	let __vonkReplCaptureLogs = repl.lines.length === 1;

	console.log = (...args: unknown[]) => {
		nativeLog.apply(console, args);
		if (__vonkReplCaptureLogs) {
			logs.push(formatLogArgs(args));
		}
	};

	try {
		const prior = repl.lines.slice(0, -1).join('\n');
		const next = repl.lines[repl.lines.length - 1];
		const code = prior ? `${prior}\n;__vonkReplCaptureLogs = true;\n${next}` : next;
		// eslint-disable-next-line no-eval -- intentional JS REPL
		const result = eval(code);

		if (repl.name) {
			namedScripts.set(repl.name, repl.lines.join('\n'));
		}

		return append([
			...logs.map((entry) => color.white(entry)),
			color.white(formatValue(result)),
		]);
	} catch (err) {
		repl.lines.pop();
		const message = err instanceof Error ? err.message : String(err);
		return append([...logs.map((entry) => color.white(entry)), error(message)]);
	} finally {
		console.log = nativeLog;
	}
}

export function scriptsCommand(args: string[]): CommandResult {
	if (args.length === 0 || isHelpArg(args[0])) {
		return commandHelpResult('scripts');
	}

	const { sub, rest } = getSubcommand(args, 'repl');

	if (sub === 'repl') {
		return startRepl(null, []);
	}

	if (sub === 'list') {
		return listScripts();
	}

	if (sub === 'create') {
		return createScript(rest[0]);
	}

	if (sub === 'update') {
		return updateScript(rest[0]);
	}

	if (sub === 'delete') {
		return deleteScript(rest[0]);
	}

	return fail(
		`Unknown scripts command: ${sub}`,
		'Try: scripts help',
	);
}

function listScripts(): CommandResult {
	if (namedScripts.size === 0) {
		return ok([
			heading('Scripts'),
			'',
			muted('No named scripts yet.'),
			muted('Create one: scripts create <name>'),
		]);
	}

	const lines = [heading('Scripts'), ''];
	for (const [name, code] of namedScripts) {
		lines.push(color.yellow(name));
		if (code) {
			for (const sourceLine of code.split('\n')) {
				lines.push(muted(`  ${sourceLine}`));
			}
		} else {
			lines.push(muted('  (empty)'));
		}
		lines.push('');
	}

	return ok(lines);
}

function createScript(name: string | undefined): CommandResult {
	if (!name) {
		return fail('Usage: scripts create <name>');
	}

	if (namedScripts.has(name)) {
		return fail(`Script already exists: ${name}`, 'Use: scripts update <name>');
	}

	namedScripts.set(name, '');
	return startRepl(name, []);
}

function updateScript(name: string | undefined): CommandResult {
	if (!name) {
		return fail('Usage: scripts update <name>');
	}

	const code = namedScripts.get(name);
	if (code === undefined) {
		return fail(`Script not found: ${name}`, 'Try: scripts list');
	}

	const initial = code.length > 0 ? code.split('\n') : [];
	return startRepl(name, initial);
}

function deleteScript(name: string | undefined): CommandResult {
	if (!name) {
		return fail('Usage: scripts delete <name>');
	}

	if (!namedScripts.has(name)) {
		return fail(`Script not found: ${name}`, 'Try: scripts list');
	}

	namedScripts.delete(name);
	return ok([`Deleted script: ${name}`]);
}
