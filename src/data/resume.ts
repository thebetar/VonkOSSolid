import { accent, color, heading, label, muted, wrapIndented, wrapText } from '@/lib/ansi';

export type ResumeLocale = 'en' | 'nl';
export type ResumeVariant = 'compact' | 'extended';

export interface ResumeExperienceItem {
	name: string;
	startDate: string;
	endDate: string;
	description: string;
	extendedDescription: string;
	extendedOnly?: boolean;
}

export interface ResumeLocaleContent {
	summary: string;
	extendedSummary: string;
	experience: ResumeExperienceItem[];
}

export const resumeContent: Record<ResumeLocale, ResumeLocaleContent> = {
	en: {
		summary: "Full-stack engineer with nearly a decade of experience across diverse domains, from government and large enterprises to smaller organisations. Strong in JavaScript/TypeScript, Node.js, Python and PHP with Angular, React, Vue, Laravel, Django and NestJS. Also experienced with AWS, Azure, CI/CD and data engineering. I value code quality and have extensive experience with unit testing using Jest, Pytest and Vitest, as well as Cypress. Outside of work I deepen my knowledge of IT topics and write technical blogs.",
		extendedSummary: "Full-stack engineer with nearly a decade of experience across diverse domains. I have experience in enterprise environments within government organisations and enterprise level organisations as well as smaller companies. I have extensive experience with JavaScript/TypeScript, Node.js, Python and PHP. Within these languages I have worked on the frontend with Angular, React, Vue and Solid.js. On the backend I have experience with Laravel, Django, NestJS, Express.js and FastAPI. I am also familiar with cloud infrastructure on AWS and Azure, CI/CD pipelines, and data engineering with SQL and Pandas. I value code quality and work with unit testing frameworks such as Jest, Pytest and Vitest, with extensive experience running them alongside Cypress. Outside of work I deepen my knowledge of various IT topics such as hashing, encryption, networking, etc. See my GitHub for more details. I also write blogs, readable on my website.",
		experience: [
			{
				name: "Mikrocloud",
				startDate: "Jul 2025",
				endDate: "Present",
				description: "Lead developer on an SD-WAN platform for Mikrotik RouterOS devices, built with Laravel on AWS Lambda (via Laravel Vapor), Nuxt.js and microservices via SQS. Writes RouterOS scripts for remote configuration and is responsible for architecture and infrastructure.",
				extendedDescription: "As the lead developer at Mikrocloud I am responsible for the technical decisions and infrastructure of an SD-WAN platform that helps users manage Mikrotik RouterOS devices. The backend is built with Laravel on AWS Lambda (via Laravel Vapor) using a microservices architecture with SQS for inter-service communication, and the frontend with Nuxt.js. I also write scripts in the RouterOS scripting language to configure routers remotely. Within this role I am responsible for the technical development of the platform, its architecture and infrastructure.",
				extendedOnly: false
			},
			{
				name: "Webshopimporter",
				startDate: "Sep 2024",
				endDate: "Present",
				description: "Lead developer managing an application that synchronises supplier data to e-commerce platforms such as Shopify, WooCommerce and Magento. Collaborating on a migration from CodeIgniter to Django and building integrations via REST, SOAP and FTP, even when supplier documentation is complex or incomplete.",
				extendedDescription: "As the lead developer at Webshopimporter I manage the application that synchronises supplier data to different e-commerce platforms such as Shopify, Lightspeed, WooCommerce, Magento and CCVShop. I collaborate on migrating the platform from the legacy CodeIgniter codebase to Django, while also building and maintaining integrations using protocols like REST, SOAP and FTP and formats like JSON, XML and CSV, even when supplier documentation is complex or incomplete. Within this role I am responsible for the technical development of these integrations and how they are implemented. For this I need to thoroughly study various supplier documentation and the APIs they provide in order to integrate them into the platform.",
				extendedOnly: false
			},
			{
				name: "Swiftsync",
				startDate: "Sep 2024",
				endDate: "Present",
				description: "Full-stack developer building custom software solutions based on client requirements, using frameworks such as Django, NiceGUI, Playwright and Pandas. Built a CCVShop management dashboard, a configurable web scraping dashboard and a Wintree product synchronisation tool.",
				extendedDescription: "As a full-stack developer at Swiftsync I work on various software solutions based on client requirements. I use various frameworks, including Django, NiceGUI, Playwright, Pandas, Gemini's API and more. I built a data management dashboard in NiceGUI that provides an easier interface for managing CCVShop product data, and a web scraping dashboard using Django and Playwright for highly configurable data extraction from websites. I also developed a product synchronisation tool between Wintree, a management system in the Dutch horticultural industry, and various e-commerce platforms, handling not only product data but also stock levels, customer groups and tier pricing. Within this role I am responsible for the technical development of these tools and how they are implemented.",
				extendedOnly: true
			},
			{
				name: "Chary Solutions",
				startDate: "Jul 2024",
				endDate: "Present",
				description: "Senior developer building marketing integrations between platforms not supported by Klaviyo, using Google Tag Manager and various APIs. Also builds internal automations and tools integrating Gemini's API to categorise data.",
				extendedDescription: "As the senior developer at Chary Solutions I handle the technical development of marketing integrations between various platforms that are not supported by Klaviyo out of the box. I use Google Tag Manager for custom tracking cookies for actions on websites and use the APIs of various companies to collect the required data and integrate it into Klaviyo. I also build internal automations, scripts and tools that streamline business processes and reduce manual work for the marketing team, including integrating Gemini's API to automatically categorise data. Within this role I am responsible for the technical development of these integrations and internal automations and how they are implemented.",
				extendedOnly: false
			},
			{
				name: "SPAR",
				startDate: "Jun 2024",
				endDate: "Dec 2024",
				description: "Data engineer at a major Dutch retail chain, parsing and mapping big data using Azure Data Factory, Azure Databricks, Pandas and PySpark to split workloads across multiple instances.",
				extendedDescription: "As a data engineer at SPAR Nederland I worked on data challenges for one of the Netherlands' largest retail chains, with a focus on parsing and mapping big data as efficiently as possible. I used Azure Data Factory, Azure Databricks and Azure SQL Database to manage and process large datasets. I used Pandas to efficiently shape data into the right form, and PySpark to split workloads into batches across multiple instances. Within this role I was responsible for the technical development of these data challenges and how they were implemented as a team member. For this I had to use my skills for working with big data and my knowledge of Azure's data services to solve the complex problems SPAR faced.",
				extendedOnly: false
			},
			{
				name: "ING",
				startDate: "Apr 2022",
				endDate: "Sep 2023",
				description: "Full-stack developer and product owner at ING, building banking interfaces with Lit web components, CI/CD pipelines and custom ESLint rules. As product owner, set realistic expectations and made every deadline by keeping team capacity and stakeholder goals aligned.",
				extendedDescription: "As a full-stack developer and product owner at ING I worked on banking interfaces built with Lit web components, focusing on code quality by writing custom ESLint rules enforced across the team and driving unit testing standards with Jest. I managed Azure DevOps CI/CD pipelines for reliable deployments. In my role as developer I used frameworks such as Lit, Node.js, ESLint and Azure DevOps to build the banking interfaces and manage the CI/CD pipelines. In my role as product owner I focused on setting realistic expectations and preventing stakeholder misalignment. What the team said they could handle was what got planned, not more. This approach meant we made every deadline and kept both the team and stakeholders aligned throughout the project. Within this role I was responsible for the technical development of these banking interfaces and how they were implemented as a team member.",
				extendedOnly: false
			},
			{
				name: "SVB",
				startDate: "Apr 2021",
				endDate: "Apr 2022",
				description: "Frontend developer at SVB, working on a translation layer dashboard between legacy AngularJS and Angular. Used Jasmine for testing and Jenkins for CI/CD pipelines.",
				extendedDescription: "As a frontend developer at SVB (Sociale Verzekeringsbank), a major Dutch government agency, I worked on a platform that translated raw data into an advanced frontend dashboard, as a translation layer between the legacy application and the new frontend. I used AngularJS for the legacy application and Angular for the new frontend, Jasmine for testing the code, and also worked with Jenkins for CI/CD pipelines. Within this role I was responsible for the technical development of this frontend and how it was implemented as a team member.",
				extendedOnly: false
			},
			{
				name: "Quintor",
				startDate: "Oct 2020",
				endDate: "Oct 2023",
				description: "Started with a traineeship at this IT consultancy and worked here for three years. Completed assignments at SVB and ING, learned from experienced consultants, and gave knowledge sessions.",
				extendedDescription: "At Quintor, an IT consultancy, I started with a traineeship and later became an IT Consultant. Over my three years here, I completed assignments at SVB and ING. During my time at the company, I learned a lot from more experienced consultants about high code quality, development pipelines, and deep testing strategies. I also shared my own knowledge by giving knowledge sessions. The role focused on working in a framework-agnostic manner, teaching me to quickly adapt to different technologies and understand the entire application stack.",
				extendedOnly: false
			},
			{
				name: "MedWeb",
				startDate: "Sep 2019",
				endDate: "Aug 2020",
				description: "Started as an intern and later became a Software Developer. Worked on advanced scheduling software for hospitals. Used HCL Notes, a document-oriented database, with LotusScript as the backend language and Vue.js as the frontend language with Chart.js to create various data dashboards.",
				extendedDescription: "At MedWeb, my first full-time role, I started as an intern and later became a Software Developer. I worked on advanced scheduling software focused on the medical field, primarily used by hospitals. Within this role I worked with HCL Notes, which is a document-oriented database, using LotusScript as the backend language and Vue.js as the frontend language, along with Chart.js to create various data dashboards for scheduling insights. I was responsible for the technical development of this platform and how it was implemented, transforming large datasets from HCL Notes into clear, readable graphs.",
				extendedOnly: true
			}
		]
	},
	nl: {
		summary: "Full-stack engineer met bijna tien jaar ervaring in diverse domeinen, van overheid en grote organisaties tot kleinere bedrijven. Sterk in Javascript/Typescript, Node.js, Python en PHP met Angular, React, Vue, Laravel, Django en NestJS. Ook ervaring met AWS, Azure, CI/CD en data engineering. Ik hecht waarde aan codekwaliteit en heb uitgebreide ervaring met unit testing via Jest, Pytest en Vitest, evenals Cypress. Buiten werk verdiep ik me in IT-onderwerpen en schrijf ik technische blogs.",
		extendedSummary: "Full-stack engineer met bijna tien jaar ervaring in diverse domeinen. Ik heb ervaring in enterprise omgevingen binnen de overheid en grote organisaties en in kleinere organisaties. Ik heb veel ervaring met Javascript/Typescript, Node.js, Python en PHP. Binnen deze talen heb ik binnen de frontend gewerkt met Angular, React, Vue en Solid.js. Binnen de backend heb ik ervaring met Laravel, Django, NestJS, Express.js en FastAPI. Ik ben ook bekend met cloudinfrastructuur op AWS en Azure, CI/CD-pipelines en data engineering met SQL en Pandas. Ik hecht waarde aan codekwaliteit en werk met unit testing frameworks zoals Jest, Pytest en Vitest, met uitgebreide ervaring in het gebruik hiervan naast Cypress. Buiten mijn werk houdt ik mij bezig met me verdiepen in verschillende IT-onderwerpen zoals hashing, encrypties, networking, etc. Zie mijn Github voor meer details. Ook schrijf ik blogs, te lezen op mijn website.",
		experience: [
			{
				name: "Mikrocloud",
				startDate: "Jul 2025",
				endDate: "Heden",
				description: "Lead developer van een SD-WAN-platform voor Mikrotik RouterOS-apparaten, gebouwd met Laravel op AWS Lambda (via Laravel Vapor), Nuxt.js en microservices via SQS. Schrijft RouterOS-scripts voor configuratie op afstand en is verantwoordelijk voor architectuur en infrastructuur.",
				extendedDescription: "Als lead developer bij Mikrocloud ben ik verantwoordelijk voor de technische beslissingen en de infrastructuur van een SD-WAN-platform dat gebruikers helpt om Mikrotik RouterOS-apparaten te beheren. De backend is gebouwd met Laravel op AWS Lambda (via Laravel Vapor) met een microservices-architectuur, via SQS voor communicatie tussen services, en de frontend met Nuxt.js. Ik schrijf ook scripts in de RouterOS-scripttaal om routers op afstand te configureren. Binnen deze rol ben ik verantwoordelijk voor de technische ontwikkeling van het platform, de architectuur en de infrastructuur.",
				extendedOnly: false
			},
			{
				name: "Webshopimporter",
				startDate: "Sep 2024",
				endDate: "Heden",
				description: "Lead developer die leveranciersdata synchroniseert naar e-commerce platformen zoals Shopify, WooCommerce en Magento. Werkt aan migratie van CodeIgniter naar Django en bouwt koppelingen via REST, SOAP en FTP, ook bij complexe of onvolledige leveranciersdocumentatie.",
				extendedDescription: "Als lead developer bij Webshopimporter beheer ik de applicatie die leveranciersdata synchroniseert naar verschillende e-commerce platformen zoals Shopify, Lightspeed, WooCommerce, Magento en CCVShop. Ik werk mee aan de migratie van het platform van de legacy CodeIgniter-codebase naar Django, terwijl ik ook koppelingen bouw en onderhoud via protocollen als REST, SOAP en FTP en formaten als JSON, XML en CSV, ook wanneer leveranciersdocumentatie complex of onvolledig is. Binnen deze rol ben ik verantwoordelijk voor de technische ontwikkeling van deze integraties en hoe deze geïmplementeerd worden. Hiervoor moet ik mij goed inlezen in verschillende leveranciersdocumentatie en de API's die ze bieden om deze vervolgens te integreren in het platform.",
				extendedOnly: false
			},
			{
				name: "Swiftsync",
				startDate: "Sep 2024",
				endDate: "Heden",
				description: "Full-stack developer die maatwerksoftware bouwt op basis van klantwensen, met frameworks als Django, NiceGUI, Playwright en Pandas. Bouwde onder meer een CCVShop-beheerdashboard, een configureerbaar web scraping dashboard en een Wintree-productsynchronisatietool.",
				extendedDescription: "Als Full-stack developer bij Swiftsync werk ik aan verschillende software oplossingen op basis van klantwensen. Hierbij gebruik ik verschillende frameworks, waaronder Django, NiceGUI, Playwright, Pandas, Gemini's API en meer. Ik heb een databeheerdashboard gebouwd in NiceGUI dat een eenvoudiger interface biedt voor het beheren van CCVShop-productdata, en een web scraping dashboard met Django en Playwright voor uiterst configureerbare data-extractie van websites. Daarnaast heb ik een productsynchronisatietool ontwikkeld tussen Wintree, een beheersysteem in de Nederlandse sierteeltsector, en diverse e-commerce platformen, voor niet alleen productdata maar ook voorraadniveaus, klantgroepen en staffelprijzen. Binnen deze rol ben ik verantwoordelijk voor de technische ontwikkeling van deze tools en hoe deze geïmplementeerd worden.",
				extendedOnly: true
			},
			{
				name: "Chary Solutions",
				startDate: "Jul 2024",
				endDate: "Heden",
				description: "Senior developer die marketingintegraties bouwt tussen platformen zonder standaard Klaviyo-koppeling, via Google Tag Manager en diverse API's. Bouwt ook interne automatiseringen en tools met Gemini's API om data te categoriseren.",
				extendedDescription: "Als senior developer bij Chary Solutions zorg ik voor de technische ontwikkeling van marketing integraties tussen verschillende platformen die niet ondersteund worden vanuit Klaviyo. Hierbij maak ik gebruik van Google Tag Manager voor custom tracking cookies voor handelingen op de website en gebruik ik de API's van verschillende bedrijven om de benodigde data te verzamelen en te integreren in Klaviyo. Daarnaast bouw ik ook interne automatiseringen, scripts en tools die de bedrijfsprocessen stroomlijnen en handmatig werk voor het marketingteam verminderen, waaronder het integreren van Gemini's API om data automatisch te categoriseren. Binnen deze rol ben ik verantwoordelijk voor de technische ontwikkeling van deze integraties en interne automatiseringen en hoe deze geïmplementeerd worden.",
				extendedOnly: false
			},
			{
				name: "SPAR",
				startDate: "Jun 2024",
				endDate: "Dec 2024",
				description: "Data engineer bij een grote Nederlandse retailketen, big data parsen en mappen met Azure Data Factory, Azure Databricks, Pandas en PySpark om werklasten over meerdere instanties te verdelen.",
				extendedDescription: "Als data engineer bij SPAR Nederland werkte ik aan datavraagstukken voor een van de grootste retailketens van Nederland, met focus op het zo efficiënt mogelijk parsen en mappen van big data. Ik gebruikte Azure Data Factory, Azure Databricks en Azure SQL Database om grote datasets te beheren en verwerken. Hierbij gebruikte ik Pandas om efficiënt data in de juiste vorm te krijgen, en PySpark om werklasten in batches over meerdere instanties te verdelen. Binnen deze rol was ik verantwoordelijk voor de technische ontwikkeling van deze datavraagstukken en hoe deze geïmplementeerd worden als teamlid. Hiervoor moest ik mijn vaardigheden voor het werken met big data gebruiken en mijn kennis van Azure's data services gebruiken om de complexe problemen op te lossen die SPAR tegemoet kwam.",
				extendedOnly: false
			},
			{
				name: "ING",
				startDate: "Apr 2022",
				endDate: "Sep 2023",
				description: "Full-stack developer en product owner bij ING, bankinterfaces gebouwd met Lit web components en CI/CD-pipelines en custom ESLint-regels ingevoerd. Als product owner realistische verwachtingen gesteld en elke deadline gehaald door teamcapaciteit en stakeholderdoelen op één lijn te houden.",
				extendedDescription: "Als Full-stack developer en product owner bij ING werkte ik aan bankinterfaces gebouwd met Lit web components, met focus op codekwaliteit door het schrijven van custom ESLint-regels die teambreed werden afgedwongen en het aansturen van unit testing standaarden met Jest. Ik beheerde Azure DevOps CI/CD-pipelines voor betrouwbare deployments. Binnen mijn rol als developer gebruikte ik frameworks als Lit, Node.js, ESLint en Azure DevOps om de bankinterfaces te bouwen en de CI/CD-pipelines te beheren. Binnen mijn rol als product owner richtte ik mij op het stellen van realistische verwachtingen en het voorkomen van misafstemming met stakeholders. Wat het team aangaf aan te kunnen was wat werd ingepland, niet meer. Deze aanpak zorgde ervoor dat we elke deadline haalden en zowel het team als de stakeholders gedurende het hele project op één lijn bleven. Binnen deze rol was ik verantwoordelijk voor de technische ontwikkeling van deze bankinterfaces en hoe deze geïmplementeerd worden als teamlid.",
				extendedOnly: false
			},
			{
				name: "SVB",
				startDate: "Apr 2021",
				endDate: "Apr 2022",
				description: "Frontend developer bij de SVB, werkte aan een vertaallaag-dashboard tussen legacy AngularJS en Angular. Gebruikte Jasmine voor testen en Jenkins voor CI/CD-pipelines.",
				extendedDescription: "Als frontend developer bij de SVB (Sociale Verzekeringsbank), een grote Nederlandse overheidsinstantie, werkte ik aan een platform dat ruwe data vertaalde naar een geavanceerd frontend dashboard, als vertaallaag tussen de legacy-applicatie en de nieuwe frontend. Ik gebruikte AngularJS voor de legacy-applicatie en Angular voor de nieuwe frontend, Jasmine voor het testen van de code, ook heb ik gewerkt met Jenkins voor de CI/CD-pipelines. Binnen deze rol was ik verantwoordelijk voor de technische ontwikkeling van deze frontend en hoe deze geïmplementeerd worden als teamlid.",
				extendedOnly: false
			},
			{
				name: "Quintor",
				startDate: "Okt 2020",
				endDate: "Okt 2023",
				description: "Begon met een traineeship bij deze IT-consultancy en werkte hier drie jaar. Heb opdrachten uitgevoerd bij de SVB en ING, veel geleerd van ervaren consultants en kennissessies gegeven.",
				extendedDescription: "Bij Quintor, een IT-consultancy, begon ik met een traineeship en werd ik later IT Consultant. In de drie jaar dat ik hier werkte, heb ik opdrachten uitgevoerd bij de SVB en ING. Tijdens mijn traineeship en verdere tijd bij het bedrijf heb ik enorm veel geleerd van meer ervaren consultants over hoge codekwaliteit, development pipelines en uitgebreide teststrategieën. Ook heb ik mijn eigen kennis gedeeld door het geven van kennissessies. De rol richtte zich op framework-agnostisch werken, waardoor ik me snel kon aanpassen aan verschillende technologieën en de volledige applicatiestack leerde begrijpen.",
				extendedOnly: false
			},
			{
				name: "MedWeb",
				startDate: "Sep 2019",
				endDate: "Aug 2020",
				description: "Begon als stagiair en daarna als Software Developer. Werkte aan geavanceerde planningssoftware voor ziekenhuizen. Binnen deze rol werkte ik met HCL Notes, een document-oriented database, met LotusScript als backend taal, Vue.js als frontend taal en Chart.js voor data dashboards.",
				extendedDescription: "Bij MedWeb, mijn eerste fulltime rol, begon ik als stagiair en daarna als Software Developer. Ik werkte aan geavanceerde planningssoftware gericht op de medische sector, voornamelijk voor ziekenhuizen. Binnen deze rol werkte ik met HCL Notes, wat een document-oriented database is, met LotusScript als backend taal en Vue.js als frontend taal, en Chart.js om verschillende data dashboards te maken voor planningsinzichten. Ik was verantwoordelijk voor de technische ontwikkeling van dit platform en hoe dit geïmplementeerd werd, waarbij ik grote datasets uit HCL Notes transformeerde naar overzichtelijke grafieken.",
				extendedOnly: true
			}
		]
	}
};

export function getResumePdfPath(variant: ResumeVariant, locale: ResumeLocale): string {
	return `/assets/pdf/resume_${locale}_${variant}.pdf`;
}

export function getResumePdfFilename(variant: ResumeVariant, locale: ResumeLocale): string {
	return `resume_${locale}_${variant}.pdf`;
}

function renderCompact(locale: ResumeLocale, downloading: boolean): string[] {
	const content = resumeContent[locale];
	const pdf = getResumePdfPath('compact', locale);
	const lines: string[] = [
		heading(`Resume · compact · ${locale.toUpperCase()}`),
		'',
		`${label('Name:')} ${color.brightWhite('Lars Vonk')}`,
		`${label('Role:')} ${accent('Full-Stack Engineer')}`,
		`${label('PDF:')}  ${color.blue(pdf)}`,
	];

	if (downloading) {
		lines.push(muted('Download started…'));
	} else {
		lines.push(muted('Hint: add --download or -d to save the PDF'));
	}

	lines.push(
		'',
		color.brightCyan('Summary'),
		...wrapText(content.summary).map((line) => color.white(line)),
		'',
		color.brightCyan('Experience'),
	);

	for (const entry of content.experience) {
		if (entry.extendedOnly) continue;
		lines.push(
			`${color.bold(color.brightWhite(entry.name))}  ${color.dim(`${entry.startDate} — ${entry.endDate}`)}`,
		);
		lines.push(...wrapIndented(entry.description).map((line) => `  ${color.white(line)}`));
		lines.push('');
	}

	return lines;
}

function renderExtended(locale: ResumeLocale, downloading: boolean): string[] {
	const content = resumeContent[locale];
	const pdf = getResumePdfPath('extended', locale);
	const lines: string[] = [
		heading(`Resume · extended · ${locale.toUpperCase()}`),
		'',
		`${label('Name:')} ${color.brightWhite('Lars Vonk')}`,
		`${label('Role:')} ${accent('Full-Stack Engineer')}`,
		`${label('PDF:')}  ${color.blue(pdf)}`,
	];

	if (downloading) {
		lines.push(muted('Download started…'));
	} else {
		lines.push(muted('Hint: add --download or -d to save the PDF'));
	}

	lines.push(
		'',
		color.brightCyan('Summary'),
		...wrapText(content.extendedSummary).map((line) => color.white(line)),
		'',
		color.brightCyan('Experience'),
	);

	for (const entry of content.experience) {
		lines.push(
			`${color.bold(color.brightWhite(entry.name))}  ${color.dim(`${entry.startDate} — ${entry.endDate}`)}`,
		);

		let body = entry.description;
		if (entry.extendedDescription) {
			body = entry.extendedDescription;
		}

		lines.push(
			...wrapIndented(body).map((line) => `  ${color.white(line)}`),
		);
		lines.push('');
	}

	return lines;
}

export function renderResume(
	variant: ResumeVariant,
	locale: ResumeLocale,
	downloading = false,
): string[] {
	if (variant === 'compact') {
		return renderCompact(locale, downloading);
	}

	return renderExtended(locale, downloading);
}
