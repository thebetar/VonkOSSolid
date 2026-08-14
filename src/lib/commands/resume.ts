import {
	getResumePdfFilename,
	getResumePdfPath,
	renderResume,
	type ResumeLocale,
	type ResumeVariant,
} from '@/data/resume';
import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { fail, getSubcommand } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

/** User-facing length tokens → internal PDF/content variant. */
function parseResumeVariant(value: string): ResumeVariant | null {
	if (value === 'short' || value === 'compact') {
		return 'compact';
	}
	if (value === 'long' || value === 'extended') {
		return 'extended';
	}
	return null;
}

function isResumeLocale(value: string): value is ResumeLocale {
	return value === 'en' || value === 'nl';
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
	const download = args.some((part) => {
		const lower = part.toLowerCase();
		return lower === '--download' || lower === '-d';
	});
	const restArgs = args.filter((part) => {
		const lower = part.toLowerCase();
		return lower !== '--download' && lower !== '-d';
	});
	const { sub, rest } = getSubcommand(restArgs, 'help');

	if (isHelpArg(sub)) {
		return commandHelpResult('resume');
	}

	if (sub !== 'get') {
		return fail(`Unknown resume command: ${sub}`, 'Try: resume help');
	}

	const normalized = rest.map((part) => part.toLowerCase());

	if (normalized.length === 0 || normalized[0] === 'default') {
		return resumeResult('extended', 'en', download);
	}

	const variant = parseResumeVariant(normalized[0]);
	const locale = normalized[1];

	if (!variant) {
		return fail(
			`Unknown resume length: ${normalized[0]}`,
			'Use: resume get <short|long> <en|nl> [--download|-d]',
		);
	}

	if (!locale) {
		return fail(
			`Usage: resume get ${normalized[0]} <en|nl> [--download|-d]`,
			'Try: resume help',
		);
	}

	if (!isResumeLocale(locale)) {
		return fail(`Unknown locale: ${locale}`, 'Use: <en|nl>');
	}

	return resumeResult(variant, locale, download);
}
