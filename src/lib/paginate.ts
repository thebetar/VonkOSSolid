import { muted, wrapText, isNarrowTerminal } from "@/lib/ansi";

export const DEFAULT_PAGE_SIZE = 5;
export const MOBILE_PAGE_SIZE = 4;

/** Smaller pages on narrow terminals so list views fit the viewport better. */
export function listPageSize(mobileSize = MOBILE_PAGE_SIZE): number {
  return isNarrowTerminal() ? mobileSize : DEFAULT_PAGE_SIZE;
}

export interface PageSlice<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize = DEFAULT_PAGE_SIZE,
): PageSlice<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  let safePage = page;
  if (safePage < 1) {
    safePage = 1;
  }
  if (safePage > totalPages) {
    safePage = totalPages;
  }

  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems,
  };
}

export function paginationFooter(
  slice: PageSlice<unknown>,
  commandHint: string,
): string[] {
  const lines = [
    "",
    ...wrapText(
      `Page ${slice.page}/${slice.totalPages} · ${slice.totalItems} items`,
    ).map((line) => muted(line)),
  ];

  if (slice.page < slice.totalPages) {
    lines.push(
      ...wrapText(
        `Next: ${commandHint} page next  ·  ${commandHint} page ${slice.page + 1}`,
      ).map((line) => muted(line)),
    );
  }

  if (slice.page > 1) {
    lines.push(
      ...wrapText(
        `Prev: ${commandHint} page prev  ·  ${commandHint} page ${slice.page - 1}`,
      ).map((line) => muted(line)),
    );
  }

  return lines;
}

export function normalizePageToken(token: string): string {
  const lower = token.toLowerCase();

  if (lower === "previous") {
    return "prev";
  }

  return lower;
}

export function isPageNavToken(token: string): boolean {
  const normalized = normalizePageToken(token);

  return (
    normalized === "n" ||
    normalized === "next" ||
    normalized === "p" ||
    normalized === "prev"
  );
}

/** Parse `page <n|next|prev>` from args. Returns remaining args and page number (default 1). */
export function parsePageArgs(
  args: string[],
  currentPage = 1,
): { page: number; rest: string[] } {
  if (!args[0]) {
    return { page: 1, rest: args };
  }

  if (args[0].toLowerCase() !== "page") {
    return { page: 1, rest: args };
  }

  const token = (args[1] ?? "").toLowerCase();

  if (token === "n" || token === "next") {
    return {
      page: currentPage + 1,
      rest: args.slice(2),
    };
  }

  if (token === "p" || token === "prev" || token === "previous") {
    return {
      page: Math.max(1, currentPage - 1),
      rest: args.slice(2),
    };
  }

  const n = Number(args[1]);

  if (!Number.isFinite(n) || n < 1) {
    return { page: 1, rest: args };
  }

  return {
    page: Math.floor(n),
    rest: args.slice(2),
  };
}
