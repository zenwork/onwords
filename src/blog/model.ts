import { LitElement } from "lit-element";

export interface BlogData {
  entry: string;
}

export function updateBlogData(ctx: LitElement, entryName: string): any {
  return (value: BlogData) => {
    ctx[entryName] = value.entry;
    ctx.requestUpdate();
  };
}

export const BLOG_DATA = 'owblogdata';
