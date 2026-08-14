import { accent, color, getWrapWidth, muted, wrapText } from "@/lib/ansi";
import {
  commandSummaryLines,
  compactCommandLines,
} from "@/lib/commands/help";

export interface OsConfig {
  osName: string;
  promptUser: string;
}

export const os: OsConfig = {
  osName: "VonkOS",
  promptUser: "guest",
};

export function getPrompt(): string {
  return `${color.brightGreen(`${os.promptUser}@${os.osName}`)}${color.brightBlue(":~$")} `;
}

export function getScriptsPrompt(): string {
  return `${color.yellow(">")} `;
}

function isNarrowScreen(): boolean {
  return getWrapWidth() < 56;
}

function tipLines(): string[] {
  return [
    muted("Tip:"),
    `  latest blog       ${accent("blog get latest")}`,
    `  see experience    ${accent("experience list")}`,
    `  see resume        ${accent("resume get default")}`,
    `  command help      ${accent("help blog")}`,
  ];
}

function introLines(compact: boolean): string[] {
  const lines = [
    color.bold(color.brightGreen(`Welcome to ${os.osName}`)),
    "",
    ...wrapText(
      compact
        ? "Type a command to explore. help lists everything."
        : "This is Lars Vonk's portfolio website, presented as a terminal interface.",
    ).map((line) => color.white(line)),
  ];

  if (!compact) {
    lines.push(
      ...wrapText("Use the commands below, or help <command> for usage.").map(
        (line) => color.white(line),
      ),
    );
  }

  lines.push("", color.brightCyan("Commands:"));
  return lines;
}

/** Full command index (one line each). Details live on help <command>. */
export function getHelpText(): string[] {
  return [
    color.bold(color.brightGreen("Help")),
    "",
    ...wrapText("Type help <command> for usage, options, and examples.").map(
      (line) => color.white(line),
    ),
    "",
    color.brightCyan("Commands:"),
    ...commandSummaryLines(),
    "",
    ...tipLines(),
    "",
  ];
}

/** Start screen: names only on phones, summaries on desktop. */
export function getWelcomeText(): string[] {
  if (isNarrowScreen()) {
    return [
      ...introLines(true),
      ...compactCommandLines(),
      "",
      ...wrapText("Type blog for usage, or help for all commands.").map(
        (line) => muted(line),
      ),
      "",
    ];
  }

  return [...introLines(false), ...commandSummaryLines(), "", ...tipLines(), ""];
}
