import { color, muted, wrapText } from '@/lib/ansi';

export const COOKIE_STORAGE_KEY = 'cookie-accept';
export const SPARK_TRACKER_URL =
	'https://cdn.jsdelivr.net/gh/thebetar/SparkTracker@master/dist/spark-tracker.min.js';

export type CookieChoice = 'accept' | 'decline';

export function getCookieChoice(): CookieChoice | null {
	const value = localStorage.getItem(COOKIE_STORAGE_KEY);

	if (value === 'accept' || value === 'decline') {
		return value;
	}

	return null;
}

export function setCookieChoice(choice: CookieChoice): void {
	localStorage.setItem(COOKIE_STORAGE_KEY, choice);
}

export function parseCookieChoice(value: string): CookieChoice | null {
	const answer = value.trim().toLowerCase();

	if (answer === 'y' || answer === 'yes' || answer === 'accept') {
		return 'accept';
	}

	if (
		answer === 'n' ||
		answer === 'no' ||
		answer === 'deny' ||
		answer === 'decline'
	) {
		return 'decline';
	}

	return null;
}

/** Boot prompt: Enter or anything unknown declines. */
export function parseCookieAnswer(line: string): CookieChoice {
	return parseCookieChoice(line) ?? 'decline';
}

export function loadAnalytics(): void {
	if (document.getElementById('spark-tracker')) {
		return;
	}

	const script = document.createElement('script');
	script.id = 'spark-tracker';
	script.defer = true;
	script.src = SPARK_TRACKER_URL;
	document.head.appendChild(script);
}

export function applyCookieChoice(choice: CookieChoice): void {
	setCookieChoice(choice);
	if (choice === 'accept') {
		loadAnalytics();
	}
}

export function enableAnalyticsIfAllowed(): void {
	if (getCookieChoice() === 'accept') {
		loadAnalytics();
	}
}

export function cookiePromptLines(): string[] {
	return [
		color.bold(color.brightGreen('Cookie statement')),
		'',
		...wrapText(
			'This site sprinkles digital cookies to see what you love. They play nice — no personal info. Privacy first, like a squirrel and its acorns.',
		).map((line) => color.white(line)),
		'',
		color.white('Accept analytics cookies?'),
		muted('y / yes to accept · n / no or Enter to decline'),
		muted('Change later with: cookies accept | cookies decline'),
		'',
	];
}
