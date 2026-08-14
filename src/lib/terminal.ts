import { Terminal as XtermTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { ImageAddon } from "@xterm/addon-image";
import "@xterm/xterm/css/xterm.css";

import { runCommand, type CommandResult } from "@/lib/commands";
import {
  evalScriptsLine,
  exitScriptsRepl,
  isScriptsReplActive,
} from "@/lib/commands/scripts";
import {
  applyCookieChoice,
  cookiePromptLines,
  enableAnalyticsIfAllowed,
  getCookieChoice,
  parseCookieAnswer,
} from "@/lib/consent";
import { commandToPath, pathToCommand } from "@/lib/routes";
import { color, muted, setWrapWidth } from "@/lib/ansi";
import {
  createLineInput,
  handleLineInputKey,
  readLineInput,
  resetLineInput,
  type LineInputState,
} from "@/lib/line-input";
import { getPrompt, getScriptsPrompt, getWelcomeText, os } from "@/data/os";
import { attachTouchScroll } from "@/lib/touch-scroll";
import {
  buildInlineImageSequence,
  imageSrcFromLine,
  imageUrlToPngBase64,
  isImageLine,
} from "@/lib/terminal-image";

const DESKTOP_FONT_SIZE = 15;
const MOBILE_FONT_SIZE = 12;
const MOBILE_MAX_WIDTH = 640;

const terminalTheme = {
  background: "#0b0f14",
  foreground: "#d6e3f0",
  cursor: "#7ee787",
  cursorAccent: "#0b0f14",
  selectionBackground: "#264f7844",
  black: "#0b0f14",
  red: "#ff7b72",
  green: "#7ee787",
  yellow: "#e3b341",
  blue: "#79c0ff",
  magenta: "#d2a8ff",
  cyan: "#56d4dd",
  white: "#d6e3f0",
  brightBlack: "#8b949e",
  brightRed: "#ffa198",
  brightGreen: "#56d364",
  brightYellow: "#e3b341",
  brightBlue: "#79c0ff",
  brightMagenta: "#d2a8ff",
  brightCyan: "#56d4dd",
  brightWhite: "#ffffff",
};

export interface TerminalMount {
  screen: HTMLElement;
}

function syncUrlForCommand(command: string): void {
  const path = commandToPath(command);
  if (!path) {
    return;
  }

  const current = `${window.location.pathname}${window.location.search}`;
  if (current === path) {
    return;
  }

  window.history.replaceState(null, "", path);
}

function preferredFontSize(): number {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches
    ? MOBILE_FONT_SIZE
    : DESKTOP_FONT_SIZE;
}

function triggerDownload(url: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/** Interactive xterm session with an inline prompt. */
export class Terminal {
  private readonly term: XtermTerminal;
  private readonly fitAddon: FitAddon;
  private readonly screen: HTMLElement;
  private readonly lineInput: LineInputState;
  private readonly onData: { dispose: () => void };
  private readonly detachTouchScroll: () => void;
  private busy = true;
  private lineWaiter: ((line: string) => void) | null = null;

  constructor(mount: TerminalMount) {
    this.screen = mount.screen;
    this.lineInput = createLineInput();

    this.term = new XtermTerminal({
      cursorBlink: true,
      disableStdin: false,
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: preferredFontSize(),
      lineHeight: 1.2,
      theme: terminalTheme,
      allowProposedApi: true,
      scrollback: 5000,
    });

    this.fitAddon = new FitAddon();
    const imageAddon = new ImageAddon({
      enableSizeReports: true,
      sixelSupport: false,
      iipSupport: true,
      showPlaceholder: true,
    });

    this.term.loadAddon(this.fitAddon);
    this.term.loadAddon(imageAddon);
    this.term.open(this.screen);
    this.syncLayout();

    this.term.options.linkHandler = {
      activate: (_event, uri) => this.openLink(uri),
      allowNonHttpProtocols: true,
    };

    this.onData = this.term.onData((data) => this.handleInput(data));
    this.detachTouchScroll = attachTouchScroll(this.term, this.screen);
    this.screen.addEventListener("mousedown", this.onScreenClick);
    window.addEventListener("resize", this.onResize);
    window.visualViewport?.addEventListener("resize", this.onResize);

    void this.boot().finally(() => {
      this.busy = false;
      this.term.focus();
    });
  }

  dispose(): void {
    this.onData.dispose();
    this.detachTouchScroll();
    this.screen.removeEventListener("mousedown", this.onScreenClick);
    window.removeEventListener("resize", this.onResize);
    window.visualViewport?.removeEventListener("resize", this.onResize);
    this.term.dispose();
  }

  private readonly onScreenClick = (): void => {
    this.term.focus();
  };

  private readonly onResize = (): void => {
    this.syncLayout();
  };

  /** Fit columns to the container and keep text wrapping aligned with the live width. */
  private syncLayout(): void {
    const nextFontSize = preferredFontSize();
    if (this.term.options.fontSize !== nextFontSize) {
      this.term.options.fontSize = nextFontSize;
    }

    this.fitAddon.fit();
    setWrapWidth(this.term.cols - 1);
  }

  private write(data: string): Promise<void> {
    return new Promise((resolve) => {
      this.term.write(data, () => resolve());
    });
  }

  private writeln(data = ""): Promise<void> {
    return new Promise((resolve) => {
      this.term.writeln(data, () => resolve());
    });
  }

  private async writeImage(src: string): Promise<void> {
    try {
      const { base64, size } = await imageUrlToPngBase64(src);
      await this.writeln("");
      await this.write(buildInlineImageSequence(base64, size));
      await this.writeln("");
    } catch {
      await this.writeln(muted(`[image unavailable] ${src}`));
    }
  }

  /**
   * Stream lines into the terminal. When `pinTop` is set, keep the viewport locked
   * at the top while content grows below (avoids chase-to-bottom then jump-up).
   */
  private async writeLines(
    lines: string[],
    options: { pinTop?: boolean } = {},
  ): Promise<void> {
    const pinTop = options.pinTop === true;

    const keepTop = () => {
      this.term.scrollToTop();
    };

    let disposeScroll: { dispose: () => void } | undefined;

    if (pinTop) {
      disposeScroll = this.term.onScroll(() => {
        keepTop();
      });
      keepTop();
    }

    try {
      for (const line of lines) {
        if (isImageLine(line)) {
          await this.writeImage(imageSrcFromLine(line));
        } else {
          await this.writeln(line);
        }

        if (pinTop) {
          keepTop();
        }
      }
    } finally {
      disposeScroll?.dispose();
    }
  }

  private applyScroll(scrollTo: "top" | "bottom"): void {
    if (scrollTo === "top") {
      this.term.scrollToTop();
    } else {
      this.term.scrollToBottom();
    }
  }

  private contentOverflowsViewport(): boolean {
    return this.term.buffer.active.baseY > 0;
  }

  /** Prompt stays at the bottom of the buffer; tall pages open scrolled to the top. */
  private finishPage(scrollTo: "top" | "bottom" = "top"): void {
    this.term.write(this.promptText());

    if (scrollTo === "bottom") {
      this.applyScroll("bottom");
      return;
    }

    // Tall content → start at top so you can read; short content → stay at bottom with the prompt.
    this.applyScroll(this.contentOverflowsViewport() ? "top" : "bottom");
  }

  private promptText(): string {
    return isScriptsReplActive() ? getScriptsPrompt() : getPrompt();
  }

  private async clearPage(): Promise<void> {
    this.syncLayout();
    // Erase via the write queue (after any pending Enter newline). Using term.clear()
    // is racy and also keeps the active prompt/command line by design.
    await this.write("\x1b[2J\x1b[3J\x1b[H");
    this.applyScroll("top");
  }

  private openLink(uri: string): void {
    if (uri.startsWith("/") && !uri.startsWith("//")) {
      const command = pathToCommand(uri);
      if (command) {
        exitScriptsRepl();
        syncUrlForCommand(command);
        void this.runCommand(command);
        return;
      }

      window.history.replaceState(null, "", uri);
      return;
    }

    window.open(uri, "_blank", "noopener,noreferrer");
  }

  private async applyCommandResult(result: CommandResult): Promise<void> {
    if (result.download) {
      triggerDownload(result.download.url, result.download.filename);
    }

    if (result.action === "append") {
      const lines = result.lines ?? [];
      if (lines.length > 0) {
        await this.writeLines(lines);
      }
      this.finishPage(result.scrollTo ?? "bottom");
      return;
    }

    if (result.action === "print" && result.lines && result.lines.length > 0) {
      await this.clearPage();
      resetLineInput(this.lineInput);
      const scrollTo = result.scrollTo ?? "top";
      await this.writeLines(result.lines, { pinTop: scrollTo === "top" });
      this.finishPage(scrollTo);
      return;
    }

    this.finishPage("bottom");
  }

  private waitForLine(): Promise<string> {
    return new Promise((resolve) => {
      this.lineWaiter = resolve;
    });
  }

  private async promptCookiesIfNeeded(): Promise<void> {
    if (getCookieChoice()) {
      enableAnalyticsIfAllowed();
      return;
    }

    await this.writeLines(cookiePromptLines());
    this.term.write(`${color.yellow("y/n")} ${color.brightBlue(">")} `);

    const answer = await this.waitForLine();
    const choice = parseCookieAnswer(answer);
    applyCookieChoice(choice);

    await this.writeln(
      choice === "accept"
        ? color.brightGreen("Cookies accepted. Analytics enabled.")
        : color.yellow("Cookies declined. Analytics stay off."),
    );
    await this.writeln("");
    await this.clearPage();
  }

  private async boot(): Promise<void> {
    this.term.focus();
    await this.promptCookiesIfNeeded();

    const initialCommand = pathToCommand(
      window.location.pathname,
      window.location.search,
    );

    if (!initialCommand) {
      await this.writeLines(getWelcomeText());
      this.finishPage("bottom");
      document.title = `${os.osName} — Portfolio`;
      return;
    }

    await this.writeLines([
      color.bold(color.brightGreen(`Welcome to ${os.osName}`)),
      muted(`Opening shared link → running: ${initialCommand}`),
      "",
    ]);
    this.term.write(this.promptText());
    this.term.writeln(initialCommand);

    await this.applyCommandResult(await runCommand(initialCommand));
    document.title = `${os.osName} — ${initialCommand}`;
  }

  private async runCommand(command: string): Promise<void> {
    if (this.busy) {
      return;
    }

    if (isScriptsReplActive()) {
      this.busy = true;

      try {
        await this.applyCommandResult(evalScriptsLine(command));
        if (!isScriptsReplActive()) {
          syncUrlForCommand("scripts help");
        }
      } finally {
        this.busy = false;
        this.term.focus();
      }
      return;
    }

    const trimmed = command.trim();
    if (trimmed) {
      syncUrlForCommand(trimmed);
    }

    this.busy = true;

    try {
      await this.applyCommandResult(await runCommand(command));
    } finally {
      this.busy = false;
      this.term.focus();
    }
  }

  private handleInput(data: string): void {
    if (this.busy && !this.lineWaiter) {
      return;
    }

    const result = handleLineInputKey(this.term, data, this.lineInput);
    if (result === "submit") {
      const command = readLineInput(this.lineInput);
      resetLineInput(this.lineInput);
      if (this.lineWaiter) {
        const resolve = this.lineWaiter;
        this.lineWaiter = null;
        resolve(command);
        return;
      }
      void this.runCommand(command);
    } else if (result === "cancel") {
      if (this.lineWaiter) {
        const resolve = this.lineWaiter;
        this.lineWaiter = null;
        resolve("");
        return;
      }
      if (isScriptsReplActive()) {
        exitScriptsRepl();
        void this.runCommand("scripts help");
        return;
      }
      this.finishPage("bottom");
    }
  }
}
