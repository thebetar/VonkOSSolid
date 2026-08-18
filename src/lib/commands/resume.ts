import {
	getResumePdfFilename,
	getResumePdfPath,
	renderResume,
	type ResumeLocale,
	type ResumeVariant,
} from '@/data/resume';
import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { fail, getSubcommand, stripFlags } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

export function resumeVariantFromToken(value: string): ResumeVariant | null {
	if (value === 'short' || value === 'compact') {
		return 'compact';
	}

	if (value === 'long' || value === 'extended') {
		return 'extended';
	}

	return null;
}

export function resumeLengthForUrl(variant: ResumeVariant): 'short' | 'long' {
	if (variant === 'compact') {
		return 'short';
	}

	return 'long';
}

function isResumeLocale(value: string): value is ResumeLocale {
	return value === 'en' || value === 'nl';
}

export type ParsedResumeArgs =
	| { kind: 'help' }
	| { kind: 'default'; download: boolean }
	| {
			kind: 'variant';
			variant: ResumeVariant;
			locale: ResumeLocale;
			download: boolean;
	  }
	| { kind: 'error'; message: string; hint: string };

export function parseResumeArgs(args: string[]): ParsedResumeArgs {
	const { kept, hasFlag: download } = stripFlags(args, [
		'--download',
		'-d',
	]);
	const { sub, rest } = getSubcommand(kept, 'help');

	if (isHelpArg(sub)) {
		return { kind: 'help' };
	}

	if (sub !== 'get') {
		return {
			kind: 'error',
			message: `Unknown resume command: ${sub}`,
			hint: 'Try: resume help',
		};
	}

	const normalized = rest.map((part) => part.toLowerCase());

	if (normalized.length === 0 || normalized[0] === 'default') {
		return { kind: 'default', download };
	}

	const variant = resumeVariantFromToken(normalized[0]);
	const locale = normalized[1];

	if (!variant) {
		return {
			kind: 'error',
			message: `Unknown resume length: ${normalized[0]}`,
			hint: 'Use: resume get <short|long> <en|nl> [--download|-d]',
		};
	}

	if (!locale) {
		return {
			kind: 'error',
			message: `Usage: resume get ${normalized[0]} <en|nl> [--download|-d]`,
			hint: 'Try: resume help',
		};
	}

	if (!isResumeLocale(locale)) {
		return {
			kind: 'error',
			message: `Unknown locale: ${locale}`,
			hint: 'Use: <en|nl>',
		};
	}

	return {
		kind: 'variant',
		variant,
		locale,
		download,
	};
}

function resumeResult(
	variant: ResumeVariant,
	locale: ResumeLocale,
	shouldDownload: boolean,
): CommandResult {
	const result: CommandResult = {
		action: 'print',
		lines: renderResume(variant, locale, shouldDownload),
		scrollTo: 'top',
	};

	if (shouldDownload) {
		result.download = {
			url: getResumePdfPath(variant, locale),
			filename: getResumePdfFilename(variant, locale),
		};
	}

	return result;
}

export function resumeCommand(args: string[]): CommandResult {
	const parsed = parseResumeArgs(args);

	if (parsed.kind === 'help') {
		return commandHelpResult('resume');
	}

	if (parsed.kind === 'error') {
		return fail(parsed.message, parsed.hint);
	}

	if (parsed.kind === 'default') {
		return resumeResult('extended', 'en', parsed.download);
	}

	return resumeResult(parsed.variant, parsed.locale, parsed.download);
}
