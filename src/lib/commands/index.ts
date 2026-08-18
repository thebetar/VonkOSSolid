import { showAbout } from '@/data/pages/about';
import { listBlogs, showBlog, showLatestBlog } from '@/data/pages/blogs';
import { showContact } from '@/data/pages/contact';
import { listEducation, showEducation } from '@/data/pages/education';
import { listExperience, showExperience } from '@/data/pages/experience';
import { listProjects, showProject } from '@/data/pages/projects';
import { getHelpText } from '@/data/os';
import {
	findCatalogEntry,
	type CommandName,
} from '@/lib/commands/catalog';
import { collectionCommand } from '@/lib/commands/collection';
import { cookiesCommand } from '@/lib/commands/cookies';
import { commandHelpResult, isHelpArg } from '@/lib/commands/help';
import { fail, ok } from '@/lib/commands/helpers';
import { resumeCommand } from '@/lib/commands/resume';
import { scriptsCommand } from '@/lib/commands/scripts';
import { skillsCommand } from '@/lib/commands/skills';
import { subscribeCommand } from '@/lib/commands/subscribe';
import type { CommandResult } from '@/lib/commands/types';

export type { CommandAction, CommandResult } from '@/lib/commands/types';

type CommandHandler = (
	args: string[],
) => CommandResult | Promise<CommandResult>;

const handlers: Record<CommandName, CommandHandler> = {
	help: (args) => {
		if (args[0]) {
			return commandHelpResult(args[0]);
		}

		return ok(getHelpText());
	},

	about: (args) => {
		if (isHelpArg(args[0])) {
			return commandHelpResult('about');
		}

		return ok(showAbout());
	},

	contact: (args) => {
		if (isHelpArg(args[0])) {
			return commandHelpResult('contact');
		}

		return ok(showContact());
	},

	subscribe: (args) => subscribeCommand(args),

	cookies: (args) => cookiesCommand(args),

	blog: (args) =>
		collectionCommand('blog', args, {
			list: listBlogs,
			get: showBlog,
			getLatest: showLatestBlog,
		}),

	experience: (args) =>
		collectionCommand('experience', args, {
			list: listExperience,
			get: showExperience,
		}),

	projects: (args) =>
		collectionCommand('projects', args, {
			list: listProjects,
			get: showProject,
		}),

	education: (args) =>
		collectionCommand('education', args, {
			list: listEducation,
			get: showEducation,
		}),

	skills: (args) => skillsCommand(args),

	scripts: (args) => scriptsCommand(args),

	resume: (args) => resumeCommand(args),
};

export async function runCommand(line: string): Promise<CommandResult> {
	const trimmed = line.trim();

	if (!trimmed) {
		return { action: 'none' };
	}

	const parts = trimmed.split(/\s+/);
	const command = parts[0].toLowerCase();
	const args = parts.slice(1);

	const entry = findCatalogEntry(command);

	if (!entry) {
		return fail(
			`Unknown command: ${command}`,
			'Type help (or h) for available commands.',
		);
	}

	return handlers[entry.name](args);
}
