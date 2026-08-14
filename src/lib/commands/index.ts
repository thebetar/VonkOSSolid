import { showAbout } from '@/data/pages/about';
import { listBlogs, showBlog, showLatestBlog } from '@/data/pages/blogs';
import { showContact } from '@/data/pages/contact';
import { listEducation, showEducation } from '@/data/pages/education';
import { listExperience, showExperience } from '@/data/pages/experience';
import { listProjects, showProject } from '@/data/pages/projects';
import { getHelpText } from '@/data/os';
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

export async function runCommand(line: string): Promise<CommandResult> {
	const trimmed = line.trim();
	if (!trimmed) return { action: 'none' };

	const parts = trimmed.split(/\s+/);
	const command = parts[0].toLowerCase();
	const args = parts.slice(1);

	switch (command) {
		case 'help':
		case 'h':
		case '?':
			if (args[0]) {
				return commandHelpResult(args[0]);
			}
			return ok(getHelpText());
		case 'about':
		case 'a':
			if (isHelpArg(args[0])) {
				return commandHelpResult('about');
			}
			return ok(showAbout());
		case 'contact':
		case 'c':
			if (isHelpArg(args[0])) {
				return commandHelpResult('contact');
			}
			return ok(showContact());
		case 'subscribe':
		case 'sub':
			return subscribeCommand(args);
		case 'cookie':
		case 'cookies':
			return cookiesCommand(args);
		case 'blog':
		case 'blogs':
		case 'b':
			return collectionCommand('blog', args, {
				list: listBlogs,
				get: showBlog,
				getLatest: showLatestBlog,
			});
		case 'experience':
		case 'experiences':
		case 'ex':
			return collectionCommand('experience', args, {
				list: listExperience,
				get: showExperience,
			});
		case 'project':
		case 'projects':
		case 'p':
			return collectionCommand('projects', args, {
				list: listProjects,
				get: showProject,
			});
		case 'education':
		case 'ed':
			return collectionCommand('education', args, {
				list: listEducation,
				get: showEducation,
			});
		case 'skill':
		case 'skills':
		case 'sk':
			return skillsCommand(args);
		case 'script':
		case 'scripts':
		case 'sc':
			return scriptsCommand(args);
		case 'resume':
		case 'r':
			return resumeCommand(args);
		default:
			return fail(`Unknown command: ${command}`, 'Type help (or h) for available commands.');
	}
}
