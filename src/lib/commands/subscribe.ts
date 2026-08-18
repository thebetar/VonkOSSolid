import { accent, color, heading, muted, success } from '@/lib/ansi';
import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { fail, ok } from '@/lib/commands/helpers';
import type { CommandResult } from '@/lib/commands/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STORAGE_KEY = 'subscribed-email';

function alreadySubscribed(email: string): CommandResult {
	return ok([
		heading('Subscribe'),
		'',
		color.yellow('This email is already subscribed.'),
		muted(`Stored locally as ${email}`),
	]);
}

function parseSubscribeResponse(text: string): {
	kind: 'exists' | 'success' | 'error';
	message?: string;
} {
	if (text.trim() === 'exists') {
		return { kind: 'exists' };
	}

	try {
		const data = JSON.parse(text) as {
			status?: string;
			message?: string;
		};

		if (data.message === 'exists') {
			return { kind: 'exists' };
		}

		if (data.status === 'success') {
			return { kind: 'success' };
		}

		return {
			kind: 'error',
			message: data.message || 'Subscription failed. Please try again later.',
		};
	} catch {
		return {
			kind: 'error',
			message: 'Subscription failed. Please try again later.',
		};
	}
}

export async function subscribeCommand(args: string[]): Promise<CommandResult> {
	if (isHelpArg(args[0])) {
		return commandHelpResult('subscribe');
	}

	const email = args.join(' ').trim().toLowerCase();
	const existing = localStorage.getItem(STORAGE_KEY);

	if (!email) {
		if (existing) {
			return ok([
				heading('Subscribe'),
				'',
				`Already subscribed as ${accent(existing)}`,
				muted('Another address: subscribe <email>'),
			]);
		}

		return fail(
			'Usage: subscribe <email>',
			'Get an email when a new blog post is published.',
		);
	}

	if (!EMAIL_RE.test(email)) {
		return fail(
			'Please enter a valid email address',
			'Usage: subscribe you@example.com',
		);
	}

	try {
		const res = await fetch('/scripts/subscribe.php', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
			signal: AbortSignal.timeout(5000),
		});
		const text = await res.text();
		const parsed = parseSubscribeResponse(text);

		if (parsed.kind === 'exists') {
			localStorage.setItem(STORAGE_KEY, email);
			return alreadySubscribed(email);
		}

		if (parsed.kind === 'success') {
			localStorage.setItem(STORAGE_KEY, email);
			return ok([
				heading('Subscribe'),
				'',
				success(`Subscribed ${email}.`),
				muted('You will be notified when a new blog post is published.'),
			]);
		}

		return fail(parsed.message || 'Subscription failed. Please try again later.');
	} catch {
		return fail(
			'Could not reach the subscription service. Please try again later.',
		);
	}
}
