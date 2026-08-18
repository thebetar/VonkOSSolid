import { blogImagesById } from '@/data/pages/blog-images';
import { findEntry } from '@/data/pages/list-page';
import { accent, color, getWrapWidth, heading, label, link, muted, wrapIndented, wrapText } from '@/lib/ansi';
import { fetchBlogViewCounts, formatViewCount, trackBlogView } from '@/lib/blog-stats';
import { imageLine } from '@/lib/terminal-image';
import { paginate, paginationFooter, listPageSize } from '@/lib/paginate';

import blog37 from './opening-the-black-box';
import blog36 from './password-policy';
import blog35 from './basic-internet-terms';
import blog34 from './agentic-coding';
import blog33 from './european-cloud-challenges';
import blog32 from './ai-unit-tests';
import blog31 from './self-hosting-services';
import blog30 from './spectrum-sensing-cognitive-radio';
import blog29 from './ai-thoughts';
import blog28 from './taking-control';
import blog27 from './matrices';
import blog26 from './iot-hobby';
import blog25 from './linux-journey';
import blog24 from './zenunet';
import blog23 from './neural-networks';
import blog22 from './how-the-internet-works';
import blog21 from './getting-back-into-studying';
import blog20 from './over-specialization';
import blog19 from './rebuilding-website';
import blog18 from './large-language-models';
import blog17 from './chrome-tips';
import blog16 from './version-control';
import blog15 from './being-bored';
import blog14 from './connected-world';
import blog13 from './moving-to-poland';
import blog12 from './degradation-code-quality';
import blog11 from './abstraction-spectrum';
import blog10 from './viability-of-monoliths';
import blog9 from './connected-stacks';
import blog8 from './love-programming';
import blog7 from './believe-yourself';
import blog6 from './divide-conquer';
import blog5 from './finding-tools';
import blog4 from './taking-notes';
import blog3 from './small-efficiencies';
import blog2 from './learning-sustainably';
import blog1 from './code-excellence';

import type { BlogEntry } from './types';

export type { BlogEntry } from './types';

export const blogs: BlogEntry[] = [
	blog37,
	blog36,
	blog35,
	blog34,
	blog33,
	blog32,
	blog31,
	blog30,
	blog29,
	blog28,
	blog27,
	blog26,
	blog25,
	blog24,
	blog23,
	blog22,
	blog21,
	blog20,
	blog19,
	blog18,
	blog17,
	blog16,
	blog15,
	blog14,
	blog13,
	blog12,
	blog11,
	blog10,
	blog9,
	blog8,
	blog7,
	blog6,
	blog5,
	blog4,
	blog3,
	blog2,
	blog1,
];

export function findBlog(query: string): BlogEntry | undefined {
	const exact = findEntry(blogs, query, (blog) => [
		blog.id,
		blog.slug,
		blog.title,
	]);

	if (exact) {
		return exact;
	}

	const q = query.trim().toLowerCase();

	for (const blog of blogs) {
		const link = blog.link.toLowerCase();

		if (link.endsWith(`/${q}`)) {
			return blog;
		}

		if (link.includes(q)) {
			return blog;
		}
	}

	return undefined;
}

function contentLines(text: string, imageSrcs: string[] = []): string[] {
	const lines: string[] = [];
	let inCode = false;
	let imageIndex = 0;

	for (const raw of text.split('\n')) {
		let line = raw.replace(/\s+$/g, '');
		if (line.trim().startsWith('```')) {
			inCode = !inCode;
			lines.push(color.dim(line.trim()));
			continue;
		}
		if (inCode) {
			lines.push(color.brightWhite(line));
			continue;
		}

		line = line.replace(/^\s+/, '');
		if (line.startsWith('## ')) {
			lines.push('');
			lines.push(color.bold(color.brightCyan(line.slice(3))));
			lines.push('');
		} else if (line.startsWith('### ')) {
			lines.push(color.bold(color.cyan(line.slice(4))));
		} else if (line.startsWith('# ')) {
			lines.push(color.bold(color.brightGreen(line.slice(2))));
		} else if (line.startsWith('#### ')) {
			lines.push(color.bold(line.slice(5)));
		} else if (line.startsWith('NOTE: ')) {
			lines.push(color.yellow(`Note: ${line.slice(6)}`));
		} else if (line.startsWith('- ')) {
			lines.push(...wrapText(`• ${line.slice(2)}`).map((l) => color.white(l)));
		} else if (line.startsWith('[Image')) {
			const src = imageSrcs[imageIndex];
			imageIndex += 1;
			const altMatch = line.match(/^\[Image:\s*([^\]]*)\]/);
			const alt = altMatch?.[1]?.trim() || 'image';

			if (src) {
				lines.push('');
				lines.push(imageLine(src));
				lines.push(color.dim(alt));
				lines.push('');
			} else {
				lines.push(color.dim(`[image missing] ${alt}`));
			}
		} else if (!line.trim()) {
			lines.push('');
		} else {
			lines.push(...wrapText(line).map((l) => color.white(l)));
		}
	}
	return lines;
}

export async function listBlogs(page: number): Promise<{ lines: string[]; page: number }> {
	const slice = paginate(blogs, page, listPageSize());
	const viewsById = await fetchBlogViewCounts();
	const lines: string[] = [
		heading('Blogs'),
		...wrapText(
			'Newest first. Use: blog get <id|slug|latest>  |  blog list page <n|next|prev>',
		).map((line) => muted(line)),
		'',
	];

	for (const blog of slice.items) {
		const views = viewsById.get(blog.numericId);
		const viewsPart =
			views === undefined
				? ''
				: `  ${color.gray('·')} ${color.yellow(formatViewCount(views))}`;

		lines.push(`${color.yellow(blog.id.padStart(2))}  ${color.bold(color.brightWhite(blog.title))}`);
		lines.push(`    ${color.dim(blog.date)}  ${color.blue(blog.slug)}${viewsPart}`);
		lines.push(...wrapIndented(blog.description, 4).map((line) => `    ${color.white(line)}`));
		lines.push('');
	}

	lines.push(...paginationFooter(slice, 'blog list'));
	return { lines, page: slice.page };
}

function renderBlog(blog: BlogEntry, views: number | null): string[] {
	const images = blogImagesById[blog.id] ?? [];
	const viewLine =
		views === null
			? []
			: [`${label('Views:')} ${color.yellow(formatViewCount(views))}`];

	return [
		heading(`Blog · ${blog.title}`),
		'',
		`${label('ID:')}    ${accent(blog.id)}`,
		`${label('Slug:')}  ${accent(blog.slug)}`,
		`${label('Date:')}  ${color.yellow(blog.date)}`,
		...viewLine,
		`${label('Share:')} ${link(`/blogs/${blog.slug}`, `/blogs/${blog.slug}`)}`,
		`${label('URL:')}   ${link(blog.link, blog.link)}`,
		'',
		...wrapText(blog.description).map((line) => color.dim(line)),
		'',
		muted('─'.repeat(Math.min(48, Math.max(16, getWrapWidth())))),
		'',
		...contentLines(blog.content, images),
		'',
		muted('─'.repeat(Math.min(48, Math.max(16, getWrapWidth())))),
		'',
		`${muted('New posts:')} ${accent('subscribe <email>')}`,
	];
}

export async function showBlog(id: string): Promise<string[] | null> {
	const blog = findBlog(id);

	if (!blog) {
		return null;
	}

	const views = await trackBlogView(blog.numericId);
	return renderBlog(blog, views);
}

export async function showLatestBlog(): Promise<string[]> {
	const blog = blogs[0];
	const views = await trackBlogView(blog.numericId);
	return renderBlog(blog, views);
}
