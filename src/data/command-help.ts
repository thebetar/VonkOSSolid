export interface CommandUsage {
	args: string;
	description: string;
}

export interface CommandHelpEntry {
	name: string;
	aliases: string[];
	summary: string;
	about: string;
	usage: CommandUsage[];
	examples: string[];
	options?: CommandUsage[];
	notes?: string[];
}

export const COMMAND_HELP: CommandHelpEntry[] = [
	{
		name: 'help',
		aliases: ['h', '?'],
		summary: 'Command list, or help for one command',
		about: 'Show available commands, or a short help page for one command.',
		usage: [
			{ args: '', description: 'List all commands' },
			{ args: '<command>', description: 'Help for one command' },
		],
		examples: ['help', 'help blog', 'help resume'],
	},
	{
		name: 'about',
		aliases: ['a'],
		summary: 'About me',
		about: 'Short bio, current work, and what I am looking for.',
		usage: [{ args: '', description: 'Show the about page' }],
		examples: ['about'],
	},
	{
		name: 'contact',
		aliases: ['c'],
		summary: 'Contact details',
		about: 'Email, GitHub, LinkedIn, and other links.',
		usage: [{ args: '', description: 'Show contact details' }],
		examples: ['contact'],
	},
	{
		name: 'subscribe',
		aliases: ['sub'],
		summary: 'Notify me of new blog posts',
		about: 'Get an email when a new blog post is published.',
		usage: [
			{ args: '', description: 'Show current subscription' },
			{ args: '<email>', description: 'Subscribe an address' },
		],
		examples: ['subscribe you@example.com'],
	},
	{
		name: 'cookies',
		aliases: ['cookie'],
		summary: 'Analytics cookie choice',
		about: 'Accept or decline analytics cookies (SparkTracker).',
		usage: [
			{ args: '', description: 'Show current choice' },
			{ args: 'accept', description: 'Allow analytics' },
			{ args: 'decline', description: 'Keep analytics off' },
			{ args: 'status', description: 'Same as cookies with no args' },
		],
		examples: ['cookies status', 'cookies accept', 'cookies decline'],
	},
	{
		name: 'blog',
		aliases: ['blogs', 'b'],
		summary: 'Blog posts',
		about: 'Read blog posts, newest first. List to browse, get to open one.',
		usage: [
			{ args: '', description: 'This help page' },
			{ args: 'list [page <n|next|prev>]', description: 'List posts' },
			{ args: 'get <id|slug|latest>', description: 'Show a full post' },
		],
		examples: ['blog list', 'blog get latest', 'blog list page next'],
	},
	{
		name: 'experience',
		aliases: ['experiences', 'ex'],
		summary: 'Work history',
		about: 'Roles and companies. List to browse, get to open one role.',
		usage: [
			{ args: '', description: 'This help page' },
			{ args: 'list [page <n|next|prev>]', description: 'List roles' },
			{ args: 'get <id>', description: 'Show one role' },
		],
		examples: ['experience list', 'experience get mikrocloud'],
	},
	{
		name: 'projects',
		aliases: ['project', 'p'],
		summary: 'Projects',
		about: 'Personal and client projects. List to browse, get to open one.',
		usage: [
			{ args: '', description: 'This help page' },
			{ args: 'list [page <n|next|prev>]', description: 'List projects' },
			{ args: 'get <id>', description: 'Show one project' },
		],
		examples: ['projects list', 'projects get vonk-utils'],
	},
	{
		name: 'education',
		aliases: ['ed'],
		summary: 'Education',
		about: 'Degrees, courses, and certificates.',
		usage: [
			{ args: '', description: 'This help page' },
			{ args: 'list [page <n|next|prev>]', description: 'List entries' },
			{ args: 'get <id>', description: 'Show one entry' },
		],
		examples: ['education list', 'education get masters-csn'],
	},
	{
		name: 'skills',
		aliases: ['skill', 'sk'],
		summary: 'Skills',
		about: 'Languages, tools, and other skills, grouped by category.',
		usage: [
			{ args: '', description: 'This help page' },
			{ args: 'list', description: 'Top skills' },
			{ args: 'get categories', description: 'List categories' },
			{ args: 'get <category>', description: 'Skills in a category' },
		],
		examples: ['skills list', 'skills get categories', 'skills get python'],
	},
	{
		name: 'scripts',
		aliases: ['script', 'sc'],
		summary: 'JavaScript scratchpad',
		about: 'A small JS REPL. Named scripts last for this browser session.',
		usage: [
			{ args: '', description: 'This help page' },
			{ args: 'repl', description: 'Open the REPL' },
			{ args: 'list', description: 'List named scripts' },
			{ args: 'create <name>', description: 'Create and open a script' },
			{ args: 'update <name>', description: 'Edit a named script' },
			{ args: 'delete <name>', description: 'Delete a named script' },
		],
		examples: ['scripts repl', 'scripts create demo', 'scripts list'],
		notes: ['Leave the REPL with .exit or Ctrl+C.'],
	},
	{
		name: 'resume',
		aliases: ['r'],
		summary: 'Resume text and PDF',
		about:
			'Show resume text in the terminal. Add --download or -d to also save the matching PDF.',
		usage: [
			{ args: 'get default', description: 'Long English (default)' },
			{ args: 'get <short|long> <en|nl>', description: 'Choose length and language' },
			{ args: 'get … --download|-d', description: 'Show text and download PDF' },
		],
		examples: [
			'resume get default',
			'resume get long en --download',
			'resume get short en -d',
			'resume get long nl',
		],
		options: [
			{ args: 'short', description: 'Compact one-page style' },
			{ args: 'long', description: 'Full detailed version' },
			{ args: 'en', description: 'English' },
			{ args: 'nl', description: 'Dutch' },
		],
		notes: ['resume get  ≡  resume get default  ≡  resume get long en'],
	},
];

export function findCommandHelp(query: string): CommandHelpEntry | undefined {
	const q = query.toLowerCase();
	return COMMAND_HELP.find(
		(entry) => entry.name === q || entry.aliases.includes(q),
	);
}
