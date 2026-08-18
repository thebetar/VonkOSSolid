import { findCommandHelp } from "@/data/command-help";
import {
  catalogPath,
  findCatalogEntry,
  type CatalogEntry,
} from "@/lib/commands/catalog";
import {
  parseResumeArgs,
  resumeLengthForUrl,
  resumeVariantFromToken,
} from "@/lib/commands/resume";
import { isPageNavToken, normalizePageToken } from "@/lib/paginate";

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

  const entry = findCatalogEntry(section);

  if (!entry) {
    return null;
  }

  if (entry.name === "help") {
    if (id) {
      return `help ${decodeURIComponent(id)}`;
    }

    return "help";
  }

  if (id === "help") {
    return `${entry.name} help`;
  }

  if (entry.kind === "page") {
    return pathToPageCommand(entry, id);
  }

  if (entry.kind === "collection") {
    return pathToCollectionCommand(entry, id, rest);
  }

  if (entry.name === "skills") {
    return pathToSkillsCommand(id, rest);
  }

  if (entry.name === "scripts") {
    return pathToScriptsCommand(id);
  }

  if (entry.name === "resume") {
    return pathToResumeCommand(id, rest);
  }

  return null;
}

function pathToPageCommand(entry: CatalogEntry, id: string | undefined): string {
  if (entry.name === "cookies" && id) {
    return `cookies ${decodeURIComponent(id)}`;
  }

  return entry.name;
}

function pathToCollectionCommand(
  entry: CatalogEntry,
  id: string | undefined,
  rest: string[],
): string {
  if (!id) {
    return `${entry.name} list`;
  }

  if (id === "page" && rest[0]) {
    const token = isPageNavToken(rest[0])
      ? normalizePageToken(rest[0])
      : rest[0];

    return `${entry.name} list page ${token}`;
  }

  return `${entry.name} get ${decodeURIComponent(id)}`;
}

function pathToSkillsCommand(
  id: string | undefined,
  rest: string[],
): string {
  if (!id) {
    return "skills list";
  }

  return `skills get ${decodeURIComponent([id, ...rest].join(" "))}`;
}

function pathToScriptsCommand(id: string | undefined): string {
  if (id === "list") {
    return "scripts list";
  }

  if (id === "repl") {
    return "scripts repl";
  }

  return "scripts";
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
    const variant = resumeVariantFromToken(hyphen[1]);

    if (variant) {
      return `resume get ${resumeLengthForUrl(variant)} ${hyphen[2]}`;
    }
  }

  const variant = resumeVariantFromToken(id);

  if (variant && (rest[0] === "en" || rest[0] === "nl")) {
    return `resume get ${resumeLengthForUrl(variant)} ${rest[0]}`;
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
  const entry = findCatalogEntry(name);

  if (!entry) {
    return null;
  }

  if (entry.name === "help") {
    if (!action) {
      return "/help";
    }

    const topic = findCommandHelp(action);
    return `/help/${topic?.name ?? encodeURIComponent(action)}`;
  }

  if (action === "help") {
    return `/help/${entry.name}`;
  }

  if (entry.kind === "page") {
    return commandToPagePath(entry, action);
  }

  if (entry.kind === "collection") {
    return commandToCollectionPath(entry, action, rest);
  }

  if (entry.name === "skills") {
    return commandToSkillsPath(action, rest);
  }

  if (entry.name === "scripts") {
    return commandToScriptsPath(action);
  }

  if (entry.name === "resume") {
    return commandToResumePath(action, rest);
  }

  return null;
}

function commandToPagePath(entry: CatalogEntry, action: string): string {
  if (entry.name === "cookies") {
    if (action) {
      return `/cookies/${encodeURIComponent(action)}`;
    }

    return "/cookies";
  }

  return `/${catalogPath(entry)}`;
}

function commandToCollectionPath(
  entry: CatalogEntry,
  action: string,
  rest: string[],
): string | null {
  const path = catalogPath(entry);

  if (!action) {
    return `/help/${entry.name}`;
  }

  if (action === "list") {
    if (rest[0] === "page" && rest[1]) {
      return `/${path}/page/${normalizePageToken(rest[1])}`;
    }

    return `/${path}`;
  }

  if (action === "get" && rest[0]) {
    return `/${path}/${encodeURIComponent(rest.join(" "))}`;
  }

  return null;
}

function commandToSkillsPath(action: string, rest: string[]): string | null {
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

function commandToScriptsPath(action: string): string {
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

function commandToResumePath(sub: string, rest: string[]): string | null {
  if (!sub || sub === "help") {
    return "/resume";
  }

  if (sub !== "get") {
    return null;
  }

  const parsed = parseResumeArgs(["get", ...rest]);

  if (parsed.kind === "default") {
    return "/resume/default";
  }

  if (parsed.kind === "variant") {
    const length = resumeLengthForUrl(parsed.variant);
    return `/resume/${length}-${parsed.locale}`;
  }

  return null;
}
