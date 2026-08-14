import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://vonkprogramming.nl';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const BLOGS_DIR = path.join(__dirname, '../src/data/pages/blogs');
const SKIP_BLOG_FILES = new Set(['index.ts', 'types.ts']);

const TODAY = new Date().toISOString().split('T')[0];

const STATIC_ROUTES = [
	{ loc: '/', priority: '1.0', changefreq: 'weekly' },
	{ loc: '/blogs', priority: '0.9', changefreq: 'weekly' },
	{ loc: '/projects', priority: '0.7', changefreq: 'monthly' },
	{ loc: '/skills', priority: '0.7', changefreq: 'yearly' },
	{ loc: '/experience', priority: '0.7', changefreq: 'yearly' },
	{ loc: '/resume', priority: '0.7', changefreq: 'yearly' },
	{ loc: '/education', priority: '0.5', changefreq: 'yearly' },
	{ loc: '/contact', priority: '0.6', changefreq: 'yearly' },
];

function extractBlogs() {
	const files = fs.readdirSync(BLOGS_DIR).filter(
		(file) => file.endsWith('.ts') && !SKIP_BLOG_FILES.has(file),
	);

	const blogs = [];
	for (const file of files) {
		const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf8');
		const slug = content.match(/slug:\s*['"]([^'"]+)['"]/)?.[1];
		const date = content.match(/date:\s*['"](\d{4}-\d{2}-\d{2})['"]/)?.[1];
		if (!slug || !date) {
			throw new Error(`Missing slug or date in ${file}`);
		}

		blogs.push({ loc: `/blogs/${slug}`, lastmod: date });
	}

	return blogs.sort((a, b) => b.lastmod.localeCompare(a.lastmod));
}

function href(loc) {
	if (loc.startsWith('http://') || loc.startsWith('https://')) {
		return loc;
	}
	return `${BASE_URL}${loc.startsWith('/') ? loc : `/${loc}`}`;
}

function buildUrl({ loc, lastmod, changefreq, priority }) {
	return `    <url>
        <loc>${href(loc)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
}

function generateSitemap() {
	const entries = [
		...STATIC_ROUTES.map((route) => buildUrl({ ...route, lastmod: TODAY })),
		...extractBlogs().map((blog) =>
			buildUrl({
				...blog,
				changefreq: 'monthly',
				priority: '0.8',
			}),
		),
	];

	const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

	fs.writeFileSync(SITEMAP_PATH, sitemapContent);
}

generateSitemap();
