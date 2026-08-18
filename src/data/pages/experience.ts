import { accent, color, heading, label, muted, wrapIndented, wrapText } from '@/lib/ansi';
import { collectionListPage, findEntry } from '@/data/pages/list-page';

export interface ExperienceEntry {
	id: string;
	name: string;
	title: string;
	skills: string[];
	location: string;
	startDate: string;
	endDate: string;
	/** Sort key YYYY-MM */
	sortDate: string;
	summary: string;
	description: string;
	link: string;
}

function clean(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

export const experience: ExperienceEntry[] = [
	{
		id: 'mikrocloud',
		name: 'Mikrocloud',
		title: 'Lead Full Stack Developer',
		skills: ['Laravel', 'Nuxt.js', 'AWS', 'MySQL', 'Mikrotik RouterOS', 'PHP', 'Stripe', 'Docker'],
		location: 'Remote - Naas, Kildare, Ireland',
		startDate: 'July 2025',
		endDate: 'Now',
		sortDate: '2025-07',
		summary:
			'Lead developer on an SD-WAN platform for Mikrotik RouterOS devices (Laravel/Vapor, Nuxt.js, AWS).',
		description: clean(`
			At Mikrocloud, I work as the lead developer responsible for the technical decisions and infrastructure of an SD-WAN platform that helps users manage Mikrotik RouterOS devices.
			The backend is built with Laravel on AWS Lambda via Laravel Vapor, using a microservices architecture with SQS for inter-service communication, and the frontend with Nuxt.js. I also write scripts in the RouterOS scripting language to configure routers remotely.
		`),
		link: 'https://www.mikrocloud.com/',
	},
	{
		id: 'webshopimporter',
		name: 'Webshopimporter',
		title: 'Lead Full Stack Developer',
		skills: ['PHP', 'Laravel', 'Django', 'MySQL', 'Github Actions', 'Magento', 'Shopify', 'WooCommerce'],
		location: 'Remote - Enschede, Overijssel, Nederland',
		startDate: 'Sep 2024',
		endDate: 'Now',
		sortDate: '2024-09',
		summary:
			'Lead developer syncing supplier data to Shopify, WooCommerce, Magento and more; migrating CodeIgniter → Django.',
		description: clean(`
			At Webshopimporter, I am the lead developer managing the application that synchronises supplier data to different e-commerce platforms such as Shopify, Lightspeed, WooCommerce, Magento and CCVShop.
			I collaborate on migrating the platform from the legacy CodeIgniter codebase to Django, while also building and maintaining integrations using REST, SOAP and FTP.
		`),
		link: 'https://www.webshopimporter.com/',
	},
	{
		id: 'swiftsync',
		name: 'Swiftsync',
		title: 'Full Stack Developer',
		skills: ['Django', 'NiceGUI', 'Playwright', 'Pandas', 'CCVShop', 'Wordpress'],
		location: 'Remote - Enschede, Overijssel, Nederland',
		startDate: 'Sep 2024',
		endDate: 'Now',
		sortDate: '2024-09',
		summary:
			'Custom client solutions with Django, NiceGUI and Playwright — dashboards, scraping and product sync.',
		description: clean(`
			At Swiftsync, I work as a full-stack developer on various software solutions based on client requirements, including a CCVShop management dashboard, a web scraping dashboard, and a Wintree product synchronisation tool.
		`),
		link: 'https://www.swiftsync.ai/',
	},
	{
		id: 'chary-solutions',
		name: 'Chary Solutions',
		title: 'Senior Developer',
		skills: ['Javascript', 'Klaviyo', 'Gemini', 'Lightspeed', 'Shopify', 'WooCommerce', 'CCVShop'],
		location: 'Amsterdam, Noord-Holland, Nederland',
		startDate: 'Jul 2024',
		endDate: 'Now',
		sortDate: '2024-07',
		summary:
			'Marketing integrations for Klaviyo, custom GTM tracking, and internal Gemini-powered automations.',
		description: clean(`
			At Chary Solutions, I handle marketing integrations between platforms not supported by Klaviyo out of the box, using Google Tag Manager and various APIs, plus internal automations with Gemini.
		`),
		link: 'https://www.spar.nl/',
	},
	{
		id: 'spar',
		name: 'SPAR',
		title: 'Data Engineer',
		skills: ['Python', 'Pandas', 'SQL', 'Azure DevOps', 'PySpark'],
		location: 'Remote - Waalwijk, Noord-Brabant, Nederland',
		startDate: 'Jun 2024',
		endDate: 'Dec 2024',
		sortDate: '2024-06',
		summary:
			'Big-data parsing and mapping for a major Dutch retailer using Azure, Pandas and PySpark.',
		description: clean(`
			At SPAR Nederland, I worked as a data engineer on data challenges for one of the Netherlands' largest retail chains, using Azure Data Factory, Databricks, Pandas and PySpark.
		`),
		link: 'https://www.spar.nl/',
	},
	{
		id: 'ing',
		name: 'ING',
		title: 'Full Stack Developer / Product Owner',
		skills: ['Lit', 'Javascript', 'Typescript', 'Jest', 'Azure DevOps', 'ESLint'],
		location: 'Amsterdam, Noord-Holland, Nederland',
		startDate: 'Apr 2022',
		endDate: 'Sep 2023',
		sortDate: '2022-04',
		summary:
			'Banking interfaces with Lit web components; also product owner keeping delivery realistic.',
		description: clean(`
			At ING, I worked as a full-stack developer and product owner on banking interfaces built with Lit web components, custom ESLint rules, Jest standards and Azure DevOps CI/CD.
		`),
		link: 'https://www.ing.nl/',
	},
	{
		id: 'quintor',
		name: 'Quintor',
		title: 'IT Consultant',
		skills: ['Javascript', 'Azure DevOps', 'node.js', 'Angular', 'React', 'Vue.js'],
		location: 'Amersfoort, Utrecht, Nederland',
		startDate: 'Oct 2020',
		endDate: 'Oct 2023',
		sortDate: '2020-10',
		summary:
			'IT consultancy traineeship → consultant; assignments at SVB and ING; knowledge sessions.',
		description: clean(`
			At Quintor I started with a traineeship and later became an IT Consultant. Over three years I completed assignments at SVB and ING and learned framework-agnostic delivery across the stack.
		`),
		link: 'https://www.quintor.nl/',
	},
	{
		id: 'svb',
		name: 'SVB',
		title: 'Frontend Developer',
		skills: ['Angular', 'Javascript', 'Jenkins', 'Cypress'],
		location: 'Amstelveen, Noord-Holland, Nederland',
		startDate: 'Apr 2021',
		endDate: 'Apr 2022',
		sortDate: '2021-04',
		summary:
			'Frontend dashboard as a translation layer between legacy AngularJS and modern Angular.',
		description: clean(`
			At SVB, I worked on a platform that translated raw data into an advanced frontend dashboard between the legacy application and the new frontend (AngularJS → Angular).
		`),
		link: 'https://www.svb.nl/',
	},
	{
		id: 'j-tax',
		name: 'J-Tax Automotive',
		title: 'Full Stack Developer',
		skills: ['Vue.js', 'Express.js', 'MongoDB'],
		location: 'Almere, Flevoland, Nederland',
		startDate: 'Jun 2021',
		endDate: 'Present',
		sortDate: '2021-06',
		summary: 'MEVN valuation-report tool integrating multiple external calculation sources.',
		description: clean(`
			At J-Tax Automotive, I built a customized tool to generate valuation reports by combining data from external calculation sources (Vue.js, Express.js, MongoDB).
		`),
		link: 'https://www.j-taxautomotive.nl/',
	},
	{
		id: 'medweb',
		name: 'MedWeb',
		title: 'Intern / Software Developer',
		skills: ['HCL Notes', 'LotusScript', 'Vue.js', 'Chart.js'],
		location: 'Hilversum, Noord-Holland, Nederland',
		startDate: 'Sep 2019',
		endDate: 'Aug 2020',
		sortDate: '2019-09',
		summary: 'Hospital scheduling software with HCL Notes, LotusScript, Vue.js and Chart.js.',
		description: clean(`
			At MedWeb, I started as an intern and later became a Software Developer on medical scheduling software for hospitals.
		`),
		link: 'https://www.medweb.nl/',
	},
	{
		id: 'floriade',
		name: 'Floriade',
		title: 'Software Developer / Intern',
		skills: ['PHP', 'CSS', 'MySQL', 'HTML'],
		location: 'Almere, Flevoland, Nederland',
		startDate: 'Sep 2018',
		endDate: 'Jun 2019',
		sortDate: '2018-09',
		summary: 'Digital platform features for the international horticultural exhibition.',
		description: clean(`
			At Floriade, I contributed to their digital platform ahead of the international horticultural exhibition using PHP, MySQL, HTML and CSS.
		`),
		link: 'https://www.floriade.com/',
	},
	{
		id: 'sanoma',
		name: 'Sanoma',
		title: 'Software Developer / Intern',
		skills: ['PHP', 'CSS', 'MySQL', 'HTML', 'Chart.js'],
		location: 'Hoofddorp, Noord-Holland, Nederland',
		startDate: 'Sep 2017',
		endDate: 'Jun 2018',
		sortDate: '2017-09',
		summary: 'Advertising-platform charts and visualizations with Chart.js.',
		description: clean(`
			At Sanoma, I focused on visualizing advertising data in advanced chart formats on their advertising platform.
		`),
		link: 'https://www.sanoma.com/',
	},
	{
		id: 'student-aan-huis',
		name: 'Student Aan Huis',
		title: 'Technical Support',
		skills: ['Windows'],
		location: 'Bussum, Noord-Holland, Nederland',
		startDate: 'Jun 2017',
		endDate: 'Mar 2018',
		sortDate: '2017-06',
		summary: 'On-site technical support: printers, networks and Windows restores.',
		description: clean(`
			At Student Aan Huis, I assisted customers with computer issues ranging from printer setups to restoring Windows systems.
		`),
		link: 'https://www.studentaanhuis.nl/',
	},
].sort((a, b) => b.sortDate.localeCompare(a.sortDate));

function findExperience(query: string): ExperienceEntry | undefined {
	return findEntry(experience, query, (entry) => [
		entry.id,
		entry.name,
		entry.name.replace(/\s+/g, '-'),
	]);
}

export function listExperience(page: number): { lines: string[]; page: number } {
	return collectionListPage({
		title: 'Experience',
		command: 'experience',
		items: experience,
		page,
		renderItem: (entry, idWidth) => [
			`${color.yellow(entry.id.padEnd(idWidth))}  ${color.bold(color.brightWhite(entry.name))}  ${color.dim(`${entry.startDate} — ${entry.endDate}`)}`,
			`  ${accent(entry.title)}`,
			...wrapIndented(entry.summary).map((line) => `  ${color.white(line)}`),
		],
	});
}

function renderExperience(entry: ExperienceEntry): string[] {
	return [
		heading(`Experience · ${entry.name}`),
		'',
		`${label('ID:')}     ${accent(entry.id)}`,
		`${label('Title:')}  ${color.brightWhite(entry.title)}`,
		`${label('When:')}   ${color.yellow(`${entry.startDate} — ${entry.endDate}`)}`,
		`${label('Where:')}  ${muted(entry.location)}`,
		`${label('Skills:')} ${entry.skills.map((skill) => color.magenta(skill)).join(muted(', '))}`,
		`${label('Link:')}   ${color.blue(entry.link)}`,
		'',
		...wrapText(entry.description).map((line) => color.white(line)),
	];
}

export function showExperience(id: string): string[] | null {
	const entry = findExperience(id);

	if (!entry) {
		return null;
	}

	return renderExperience(entry);
}
