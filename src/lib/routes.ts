import { findCommandHelp } from "@/data/command-help";

const SIMPLE = new Set([
  "about",
  "contact",
  "help",
  "subscribe",
  "cookies",
  "cookie",
  "a",
  "c",
  "h",
  "sub",
]);

/** One entry per collection: command noun, URL segment, and accepted aliases. */
const COLLECTIONS = [
  { command: "blog", path: "blogs", aliases: ["blog", "blogs", "b"] },
  {
    command: "experience",
    path: "experience",
    aliases: ["experience", "experiences", "ex"],
  },
  {
    command: "projects",
    path: "projects",
    aliases: ["project", "projects", "p"],
  },
  {
    command: "education",
    path: "education",
    aliases: ["education", "ed"],
  },
] as const;

const RESUME_LENGTH: Record<string, "short" | "long"> = {
  short: "short",
  compact: "short",
  long: "long",
  extended: "long",
};

const PAGE_NAV = new Set(["n", "next", "p", "prev", "previous"]);

function collectionByAlias(alias: string) {
  return COLLECTIONS.find((entry) =>
    (entry.aliases as readonly string[]).includes(alias),
  );
}

function normalizePageToken(token: string): string {
  const lower = token.toLowerCase();
  return lower === "previous" ? "prev" : lower;
}

function stripDownloadFlags(parts: string[]): string[] {
  return parts.filter((part) => {
    const lower = part.toLowerCase();
    return lower !== "--download" && lower !== "-d";
  });
}

export function pathToCommand(pathname: string, search = ""): string | null {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const cmdParam = new URLSearchParams(query).get("cmd")?.trim();
  if (cmdParam) {
    return cmdParam;
  }

  const path = pathname.replace(/\/+$/, "") || "/";
  const [section, id, ...rest] = path.split("/").filter(Boolean);
  if (!section) {
    return null;
  }

  if (SIMPLE.has(section)) {
    if (section === "h" || section === "help") {
      return id ? `help ${decodeURIComponent(id)}` : "help";
    }
    if (id === "help") {
      const topic = findCommandHelp(section);
      if (topic) {
        return `${topic.name} help`;
      }
    }
    if (section === "a") return "about";
    if (section === "c") return "contact";
    if (section === "cookie") {
      return id ? `cookies ${decodeURIComponent(id)}` : "cookies";
    }
    if (section === "subscribe") {
      return "subscribe";
    }
    if (section === "cookies" && id) {
      return `cookies ${decodeURIComponent(id)}`;
    }
    return section;
  }

  const collection = collectionByAlias(section);
  if (collection) {
    if (!id) {
      return `${collection.command} list`;
    }
    if (id === "help") {
      return `${collection.command} help`;
    }
    if (id === "page" && rest[0]) {
      const token = PAGE_NAV.has(rest[0].toLowerCase())
        ? normalizePageToken(rest[0])
        : rest[0];
      return `${collection.command} list page ${token}`;
    }
    return `${collection.command} get ${decodeURIComponent(id)}`;
  }

  if (section === "skills" || section === "skill" || section === "sk") {
    if (!id) {
      return "skills list";
    }
    if (id === "help") {
      return "skills help";
    }
    return `skills get ${decodeURIComponent([id, ...rest].join(" "))}`;
  }

  if (section === "script" || section === "sc") {
    if (id === "list") {
      return "scripts list";
    }
    if (id === "help") {
      return "scripts help";
    }
    if (id === "repl") {
      return "scripts repl";
    }
    return "scripts";
  }

  if (section === "resume" || section === "r") {
    return pathToResumeCommand(id, rest);
  }

  return null;
}

function pathToResumeCommand(id: string | undefined, rest: string[]): string {
  if (!id) {
    return "resume help";
  }
  if (id === "default") {
    return "resume get default";
  }

  const hyphen = /^(short|long|compact|extended)-(en|nl)$/.exec(id);
  if (hyphen) {
    return `resume get ${RESUME_LENGTH[hyphen[1]]} ${hyphen[2]}`;
  }

  const length = RESUME_LENGTH[id];
  if (length && (rest[0] === "en" || rest[0] === "nl")) {
    return `resume get ${length} ${rest[0]}`;
  }

  return "resume help";
}

/** Build a shareable path for a command when possible. */
export function commandToPath(command: string): string | null {
  const [cmd, sub = "", ...rest] = command.trim().split(/\s+/);
  if (!cmd) {
    return null;
  }

  const name = cmd.toLowerCase();
  const action = sub.toLowerCase();

  if (name === "help" || name === "h" || name === "?") {
    if (!action) {
      return "/help";
    }
    const topic = findCommandHelp(action);
    return `/help/${topic?.name ?? encodeURIComponent(action)}`;
  }

  if (action === "help") {
    const topic = findCommandHelp(name);
    if (topic) {
      return `/help/${topic.name}`;
    }
  }

  if (SIMPLE.has(name)) {
    if (name === "a") return "/about";
    if (name === "c") return "/contact";
    if (name === "sub" || name === "subscribe") {
      return "/subscribe";
    }
    if (name === "cookie" || name === "cookies") {
      if (action) {
        return `/cookies/${encodeURIComponent(action)}`;
      }
      return "/cookies";
    }
    return `/${name}`;
  }

  const collection = collectionByAlias(name);
  if (collection) {
    if (!action) {
      return `/help/${collection.command}`;
    }
    if (action === "list") {
      if (rest[0] === "page" && rest[1]) {
        return `/${collection.path}/page/${normalizePageToken(rest[1])}`;
      }
      return `/${collection.path}`;
    }
    if (action === "get" && rest[0]) {
      if (collection.path === "blogs" && rest[0].toLowerCase() === "latest") {
        return "/blogs/latest";
      }
      return `/${collection.path}/${encodeURIComponent(rest.join(" "))}`;
    }
    return null;
  }

  if (name === "skills" || name === "skill" || name === "sk") {
    if (!action) {
      return "/help/skills";
    }
    if (action === "list") {
      return "/skills";
    }
    if (action === "get" && rest[0]) {
      return `/skills/${encodeURIComponent(rest.join(" "))}`;
    }
    return null;
  }

  if (name === "scripts" || name === "script" || name === "sc") {
    if (!action) {
      return "/help/scripts";
    }
    if (action === "list") {
      return "/script/list";
    }
    if (action === "repl") {
      return "/script/repl";
    }
    return "/script";
  }

  if (name === "resume" || name === "r") {
    return commandToResumePath(action, rest);
  }

  return null;
}

function commandToResumePath(sub: string, rest: string[]): string | null {
  if (!sub || sub === "help") {
    return "/resume";
  }
  if (sub !== "get") {
    return null;
  }

  const parts = stripDownloadFlags(rest).map((part) => part.toLowerCase());
  if (!parts[0] || parts[0] === "default") {
    return "/resume/default";
  }

  const length = RESUME_LENGTH[parts[0]];
  if (length && (parts[1] === "en" || parts[1] === "nl")) {
    return `/resume/${length}-${parts[1]}`;
  }

  return null;
}
