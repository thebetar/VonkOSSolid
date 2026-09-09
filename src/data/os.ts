import { accent, color, muted, wrapText } from "@/lib/ansi";
import { commandSummaryLines } from "@/lib/commands/help";

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

function tipLines(): string[] {
  return [
    muted("Tip:"),
    `  latest blog       ${accent("blog get latest")}`,
    `  see experience    ${accent("experience list")}`,
    `  see resume        ${accent("resume get default")}`,
    `  command help      ${accent("help blog")}`,
  ];
}

function introLines(): string[] {
  return [
    color.bold(color.brightGreen(`Welcome to ${os.osName}`)),
    "",
    ...wrapText(
      "This is Lars Vonk's portfolio website, presented as a terminal interface.",
    ).map((line) => color.white(line)),
    ...wrapText("Use the commands below, or help <command> for usage.").map(
      (line) => color.white(line),
    ),
    "",
    color.brightCyan("Commands:"),
  ];
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

/** Start screen: same command list on phone and desktop. */
export function getWelcomeText(): string[] {
  return [...introLines(), ...commandSummaryLines(), "", ...tipLines(), ""];
}
