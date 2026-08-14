import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INDEX_HTML_PATH = path.join(__dirname, '../index.html');
const BLOGS_DIR = path.join(__dirname, '../src/data/pages/blogs');
const SKIP_BLOG_FILES = new Set(['index.ts', 'types.ts']);

const START_MARKER = '<!-- STATIC_CONTENT_START -->';
const END_MARKER = '<!-- STATIC_CONTENT_END -->';

function read(filePath) {
	return fs.readFileSync(filePath, 'utf8');
}

function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function unescapeJsString(value) {
	return value
		.replace(/\\n/g, '\n')
		.replace(/\\t/g, '\t')
		.replace(/\\"/g, '"')
		.replace(/\\'/g, "'")
		.replace(/\\\\/g, '\\');
}

function readQuoted(source, start) {
	const quote = source[start];
	if (quote !== "'" && quote !== '"' && quote !== '`') {
		return null;
	}

	let value = '';
	for (let i = start + 1; i < source.length; i += 1) {
		const ch = source[i];
		if (ch === '\\' && i + 1 < source.length && quote !== '`') {
			value += ch + source[i + 1];
			i += 1;
			continue;
		}
		if (ch === quote) {
			return unescapeJsString(value);
		}
		value += ch;
	}

	return null;
}

function field(block, name) {
	const match = block.match(new RegExp(`${name}:\\s*(?:clean\\(\\s*)?`));
	if (!match || match.index === undefined) {
		return '';
	}

	let i = match.index + match[0].length;
	while (i < block.length && /\s/.test(block[i])) {
		i += 1;
	}

	const value = readQuoted(block, i);
	return value ? value.replace(/\s+/g, ' ').trim() : '';
}

function extractObjectBlocks(filePath, exportName) {
	const source = read(filePath);
	const exportIdx = source.indexOf(`export const ${exportName}`);
	if (exportIdx < 0) {
		throw new Error(`Missing export ${exportName} in ${filePath}`);
	}

	const assignIdx = source.indexOf('=', exportIdx);
	const arrStart = assignIdx < 0 ? -1 : source.indexOf('[', assignIdx);
	if (arrStart < 0) {
		throw new Error(`Could not find ${exportName} array in ${filePath}`);
	}
	const objects = [];
	let depth = 0;
	let objectStart = -1;
	let quote = null;

	for (let i = arrStart; i < source.length; i += 1) {
		const ch = source[i];
		const prev = source[i - 1];

		if (quote) {
			if (ch === quote && prev !== '\\') {
				quote = null;
			}
			continue;
		}

		if (ch === "'" || ch === '"' || ch === '`') {
			quote = ch;
			continue;
		}

		if (ch === '[' || ch === '{') {
			if (ch === '{' && depth === 1) {
				objectStart = i;
			}
			depth += 1;
			continue;
		}

		if (ch === ']' || ch === '}') {
			if (ch === '}' && depth === 2 && objectStart >= 0) {
				objects.push(source.slice(objectStart, i + 1));
				objectStart = -1;
			}
			depth -= 1;
			if (ch === ']' && depth === 0) {
				break;
			}
		}
	}

	return objects;
}

function extractBlogs() {
	const files = fs.readdirSync(BLOGS_DIR).filter(
		(file) => file.endsWith('.ts') && !SKIP_BLOG_FILES.has(file),
	);

	const blogs = files.map((file) => {
		const content = read(path.join(BLOGS_DIR, file));
		const slug = field(content, 'slug');
		const title = field(content, 'title');
		const description = field(content, 'description');
		const date = field(content, 'date');
		if (!slug || !title || !date) {
			throw new Error(`Missing slug, title, or date in ${file}`);
		}
		return { slug, title, description, date };
	});

	return blogs.sort((a, b) => b.date.localeCompare(a.date));
}

function listItems(items) {
	return items
		.map((item) => {
			const href = item.href ? ` href="${escapeHtml(item.href)}"` : '';
			const label = item.href
				? `<a${href}>${escapeHtml(item.label)}</a>`
				: escapeHtml(item.label);
			const description = item.description
				? `<p>${escapeHtml(item.description)}</p>`
				: '';
			return `\t\t\t\t\t\t<li>${label}${description}</li>`;
		})
		.join('\n');
}

function section(command, title, items) {
	return [
		`\t\t\t\t<pre><span class="prompt">guest@VonkOS:~$</span> ${command}</pre>`,
		'\t\t\t\t<section>',
		`\t\t\t\t\t<h2>${title}</h2>`,
		'\t\t\t\t\t<ul>',
		listItems(items),
		'\t\t\t\t\t</ul>',
		'\t\t\t\t</section>',
	].join('\n');
}

function generateStaticContent() {
	const experience = extractObjectBlocks(
		path.join(__dirname, '../src/data/pages/experience.ts'),
		'experience',
	).map((block) => ({
		href: `/experience/${field(block, 'id')}`,
		label: field(block, 'name'),
		description: field(block, 'summary'),
	}));

	const projects = extractObjectBlocks(
		path.join(__dirname, '../src/data/pages/projects.ts'),
		'projects',
	).map((block) => ({
		href: `/projects/${field(block, 'id')}`,
		label: field(block, 'title'),
		description: field(block, 'description'),
	}));

	const education = extractObjectBlocks(
		path.join(__dirname, '../src/data/pages/education.ts'),
		'education',
	).map((block) => ({
		href: `/education/${field(block, 'id')}`,
		label: field(block, 'name'),
		description: field(block, 'summary'),
	}));

	const skills = extractObjectBlocks(
		path.join(__dirname, '../src/data/pages/skills.ts'),
		'skills',
	).map((block) => ({
		label: field(block, 'title'),
	}));

	const blogs = extractBlogs().map((blog) => ({
		href: `/blogs/${blog.slug}`,
		label: blog.title,
		description: blog.description,
	}));

	const html = [
		START_MARKER,
		section('experience list', 'Experience', experience),
		'',
		section('blog list', 'Blog', blogs),
		'',
		section('projects list', 'Projects', projects),
		'',
		section('education list', 'Education', education),
		'',
		section('skills list', 'Skills', skills),
		`\t\t\t\t${END_MARKER}`,
	].join('\n');

	let indexHtml = read(INDEX_HTML_PATH);
	const blockRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

	if (!blockRegex.test(indexHtml)) {
		throw new Error(`Missing ${START_MARKER} / ${END_MARKER} in index.html`);
	}

	indexHtml = indexHtml.replace(blockRegex, html);
	fs.writeFileSync(INDEX_HTML_PATH, indexHtml, 'utf8');
}

generateStaticContent();
