import { accent, color, heading, muted, success } from '@/lib/ansi';
import {
	applyCookieChoice,
	getCookieChoice,
	parseCookieChoice,
	type CookieChoice,
} from '@/lib/consent';
import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { fail, getSubcommand, ok } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

function statusLines(choice: CookieChoice | null): string[] {
	let current = muted('not set');

	if (choice === 'accept') {
		current = color.brightGreen('accepted');
	} else if (choice === 'decline') {
		current = color.yellow('declined');
	}

	return [
		heading('Cookies'),
		'',
		`Analytics cookies: ${current}`,
		'',
		muted('Usage: cookies accept | cookies decline | cookies status'),
	];
}

export function cookiesCommand(args: string[]): CommandResult {
	const { sub } = getSubcommand(args, 'status');

	if (isHelpArg(sub)) {
		return commandHelpResult('cookies');
	}

	if (sub === 'status' || sub === 'get') {
		return ok(statusLines(getCookieChoice()), 'bottom');
	}

	const choice = parseCookieChoice(sub);

	if (choice === 'accept') {
		applyCookieChoice('accept');
		return ok(
			[
				heading('Cookies'),
				'',
				success('Analytics cookies accepted.'),
				muted('SparkTracker is now enabled for this browser.'),
			],
			'bottom',
		);
	}

	if (choice === 'decline') {
		applyCookieChoice('decline');
		return ok(
			[
				heading('Cookies'),
				'',
				color.yellow('Analytics cookies declined.'),
				muted('Reload the page if tracking was already running this session.'),
				muted(`Change later with ${accent('cookies accept')}`),
			],
			'bottom',
		);
	}

	return fail(
		`Unknown cookies command: ${sub}`,
		'Try: cookies help',
	);
}
