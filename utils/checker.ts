import { editor } from "../core.ts";
import type { Page } from "../deps.ts";
import { parseMarkdown } from "../deps.ts";

export const hecker = async (
  version: string,
  content: string,
): Promise<Page> => {
  const existing = (await editor.getPages());

  for (const some of existing.pages) {
    if (some.title === `Rust ${version}`) {
      return some;
    }
  }

  return await editor.create({
    title: `Rust ${version}`,
    content: parseMarkdown(content) ||
      "Oops, something happened while fetching data",
  });
};

export default hecker;
