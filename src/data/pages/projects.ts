import { accent, color, heading, label, link, wrapIndented, wrapText } from '@/lib/ansi';
import { collectionListPage, findEntry } from '@/data/pages/list-page';

export interface ProjectEntry {
	id: string;
	title: string;
	description?: string;
	githubUrl?: string;
	liveUrl?: string;
	language?: string;
	/** Sort key YYYY-MM — newest first */
	sortDate: string;
}

function clean(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

function slugify(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export const projects: ProjectEntry[] = [
	{
		id: 'vonk-utils',
		title: 'Vonk Utils',
		description: clean(
			'Monorepo of small projects recreating well-known tools and protocols — compression, hashing, messaging, databases, proxies, and more — mostly in C, C++, Go, and TypeScript. Includes abeona-proxy, chronos-cron, mimir-cache, janus-zip, kwik-mq, pheme-protocol, NetworkSpeedTest, SparkTracker, VonkHash, VonkEncrypt, VonkDB, VonkListTree, VonkEditor, and VonkCountGame.',
		),
		githubUrl: 'https://github.com/thebetar/vonk-utils',
		language: 'go/c/c++/ts',
		sortDate: '2026-08',
	},
	{
		id: 'vonk-wifi-scan',
		title: 'Vonk Wifi Scan',
		description: clean(
			'Scan each WiFi channel using promiscuous mode to find the quietest channel for your network.',
		),
		githubUrl: 'https://github.com/thebetar/VonkWifiScan',
		sortDate: '2025-11',
	},
	{
		id: 'vonkserver',
		title: 'VonkServer (home automation)',
		description: clean(
			'A simple C web server used as the hub for home automation on a Raspberry Pi with ESP32 sensors.',
		),
		githubUrl: 'https://github.com/thebetar/Vonkserver',
		language: 'c',
		sortDate: '2025-08',
	},
	{
		id: 'assistai',
		title: 'AssistAI',
		description: clean(
			'RAG tool that uses notes as context — foundation for an AI note-taking app.',
		),
		githubUrl: 'https://github.com/thebetar/AssistAI',
		language: 'python',
		sortDate: '2025-06',
	},
	{
		id: 'portfolio-solid',
		title: 'Portfolio website (Solid)',
		description: clean('This portfolio, built with SolidJS (now presented as VonkOS).'),
		githubUrl: 'https://github.com/thebetar/VonkProgrammingSolid',
		language: 'typescript',
		sortDate: '2025-05',
	},
	{
		id: 'spectrum-x86',
		title: 'x86 assembly',
		description: clean("Master's coursework and practice for x86 assembly."),
		githubUrl: 'https://github.com/thebetar/x86-assembly',
		language: 'assembly',
		sortDate: '2025-03',
	},
	{
		id: 'risc-v-assembly',
		title: 'Risc-V assembly',
		description: clean("Master's coursework and practice for RISC-V assembly."),
		githubUrl: 'https://github.com/thebetar/RISC-V-assembly',
		language: 'assembly',
		sortDate: '2025-02',
	},
	{
		id: 'resilient-hosting',
		title: 'Resilient hosting',
		description: clean(
			'Docker Compose setup showcasing replication and fail-safes when a container crashes.',
		),
		githubUrl: 'https://github.com/thebetar/ResillientHosting',
		language: 'docker',
		sortDate: '2024-12',
	},
	{
		id: 'encrypted-messaging',
		title: 'Encrypted replicated messaging',
		description: clean(
			'Distributed CLI messaging with encrypted messages between nodes.',
		),
		githubUrl: 'https://github.com/thebetar/EncryptedMessageExchange',
		language: 'javascript',
		sortDate: '2024-10',
	},
	{
		id: 'zenunet',
		title: 'ZenuNet',
		description: clean(
			'Easy neural-network configuration — React.js and PHP web app.',
		),
		liveUrl: 'https://zenunet.nl/',
		language: 'javascript',
		sortDate: '2024-06',
	},
	{
		id: 'vonk-count-game',
		title: 'VonkCountGame',
		description: clean('A simple counting game built to practise C++.'),
		githubUrl: 'https://github.com/thebetar/VonkCountGame',
		language: 'C++',
		sortDate: '2024-04',
	},
	{
		id: 'vonk-maze',
		title: 'VonkMaze',
		description: clean('A maze game built to practise C++.'),
		githubUrl: 'https://github.com/thebetar/VonkMaze',
		language: 'C++',
		sortDate: '2024-03',
	},
	{
		id: 'vonk-encrypt',
		title: 'VonkEcrypt',
		description: clean('CLI file encrypt/decrypt tool for C++ and cryptography practice.'),
		githubUrl: 'https://github.com/thebetar/VonkEncrypt',
		language: 'C++',
		sortDate: '2024-02',
	},
	{
		id: 'vonk-list-tree',
		title: 'VonkListTree',
		description: clean('CLI directory tree tool for C++ and data-structure practice.'),
		githubUrl: 'https://github.com/thebetar/VonkListTree',
		language: 'C++',
		sortDate: '2024-01',
	},
	{
		id: 'vonk-db',
		title: 'VonkDB',
		description: clean('Simple CSV-backed database for C++ practice.'),
		githubUrl: 'https://github.com/thebetar/VonkDB',
		language: 'C++',
		sortDate: '2023-11',
	},
	{
		id: 'vonk-hash',
		title: 'VonkHash',
		description: clean('Simple hash CLI for checksums — C and cryptography practice.'),
		githubUrl: 'https://github.com/thebetar/VonkHash',
		language: 'C',
		sortDate: '2023-09',
	},
	{
		id: 'arduino-christmas',
		title: 'ArduinoChristmas',
		description: clean(
			'Soldered Christmas tree with speaker and lights controlled by timer or button.',
		),
		githubUrl: 'https://github.com/thebetar/ArduinoChristmas',
		language: 'C',
		sortDate: '2023-12',
	},
	{
		id: 'portfolio-astro',
		title: 'Portfolio website (Astro)',
		description: clean('Previous portfolio website built with Astro.'),
		githubUrl: 'https://github.com/thebetar/VonkProgrammingAstro',
		language: 'javascript',
		sortDate: '2023-06',
	},
	{
		id: 'advent-of-code',
		title: 'Advent of code',
		description: clean('Yearly Advent of Code solutions in Go, Python and JavaScript.'),
		githubUrl: 'https://github.com/thebetar/AdventOfCode',
		liveUrl: 'https://adventofcode.com/',
		language: 'go',
		sortDate: '2023-12',
	},
	{
		id: 'voice-calculator',
		title: 'Voice calculator',
		githubUrl: 'https://github.com/thebetar/IASRProject',
		language: 'python',
		sortDate: '2023-04',
	},
	{
		id: 'eslint-custom-rules',
		title: 'ESlint custom rules',
		githubUrl: 'https://github.com/thebetar/EslintCustomRules',
		language: 'javascript',
		sortDate: '2023-02',
	},
	{
		id: 'bun-vs-node',
		title: 'Bun vs Node',
		githubUrl: 'https://github.com/thebetar/BunVsNode',
		language: 'javascript',
		sortDate: '2023-01',
	},
	{
		id: 'fietstracker',
		title: 'FietsTracker',
		githubUrl: 'https://github.com/thebetar/fietsTracker',
		language: 'javascript',
		sortDate: '2022-08',
	},
	{
		id: 'klets',
		title: 'Klets',
		liveUrl: 'https://vonkprogramming.nl',
		language: 'javascript',
		sortDate: '2022-04',
	},
	{
		id: 'deet',
		title: 'Deet',
		liveUrl: 'https://play.google.com/store/apps/details?id=nl.vonkprogramming.deetcalendar',
		language: 'javascript',
		sortDate: '2021-10',
	},
	{
		id: 'fyndyr',
		title: 'Fyndyr',
		githubUrl: 'https://github.com/thebetar/Fyndyr',
		liveUrl: 'https://play.google.com/store/apps/details?id=nl.vonkprogramming.fyndyr',
		language: 'javascript',
		sortDate: '2021-06',
	},
].sort((a, b) => b.sortDate.localeCompare(a.sortDate));

function findProject(query: string): ProjectEntry | undefined {
	return findEntry(projects, query, (project) => [
		project.id,
		project.title,
		slugify(project.title),
	]);
}

export function listProjects(page: number): { lines: string[]; page: number } {
	return collectionListPage({
		title: 'Projects',
		command: 'projects',
		items: projects,
		page,
		renderItem: (project, idWidth) => {
			let titleLine = `${color.yellow(project.id.padEnd(idWidth))}  ${color.bold(color.brightWhite(project.title))}`;

			if (project.language) {
				titleLine += color.magenta(` [${project.language}]`);
			}

			const lines = [titleLine];

			if (project.description) {
				lines.push(
					...wrapIndented(project.description).map((line) => `  ${color.white(line)}`),
				);
			}

			if (project.githubUrl) {
				lines.push(`  ${label('GitHub:')} ${link(project.githubUrl, project.githubUrl)}`);
			}

			if (project.liveUrl) {
				lines.push(`  ${label('Live:')}   ${link(project.liveUrl, project.liveUrl)}`);
			}

			return lines;
		},
	});
}

function renderProject(project: ProjectEntry): string[] {
	const lines = [
		heading(`Project · ${project.title}`),
		'',
		`${label('ID:')} ${accent(project.id)}`,
	];
	if (project.language) {
		lines.push(`${label('Lang:')} ${accent(project.language)}`);
	}

	if (project.githubUrl) {
		lines.push(`${label('GitHub:')} ${link(project.githubUrl, project.githubUrl)}`);
	}

	if (project.liveUrl) {
		lines.push(`${label('Live:')} ${link(project.liveUrl, project.liveUrl)}`);
	}

	if (project.description) {
		lines.push('');
		lines.push(...wrapText(project.description).map((line) => color.white(line)));
	}

	return lines;
}

export function showProject(id: string): string[] | null {
	const project = findProject(id);

	if (!project) {
		return null;
	}

	return renderProject(project);
}
