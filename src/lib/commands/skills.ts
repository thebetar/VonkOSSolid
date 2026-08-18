import {
	listSkillCategories,
	listTopSkills,
	showSkillCategory,
} from '@/data/pages/skills';
import { fail, ok } from '@/lib/commands/helpers';
import { runSubcommands } from '@/lib/commands/subcommands';
import type { CommandResult } from '@/lib/commands/types';

export function skillsCommand(args: string[]): Promise<CommandResult> {
	return runSubcommands(
		'skills',
		args,
		{
			list: (rest) => {
				if (rest.length > 0) {
					return fail(
						`Unexpected arguments: ${rest.join(' ')}`,
						'Usage: skills list',
					);
				}

				return ok(listTopSkills());
			},

			get: (rest) => {
				const query = rest.join(' ').trim();

				if (!query) {
					return fail(
						'Usage: skills get <category>',
						'Try: skills get categories',
					);
				}

				const normalized = query.toLowerCase();

				if (normalized === 'categories' || normalized === 'category') {
					return ok(listSkillCategories());
				}

				const lines = showSkillCategory(query);

				if (!lines) {
					return fail(
						`Unknown skill category: ${query}`,
						'Try: skills get categories',
					);
				}

				return ok(lines);
			},
		},
		{ defaultSub: 'list' },
	);
}
