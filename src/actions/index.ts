import { ActionError } from "astro/actions/runtime/virtual/shared.js";
import { defineAction } from "astro:actions";
import { db, eq, sql, Views } from "astro:db";
import { z } from "astro:schema";

export const server = {
  getViews: defineAction({
    input: z.object({
      postSlug: z.string(),
    }),
    handler: async ({ postSlug }) => {
      try {
        const views = await db
          .select()
          .from(Views)
          .where(eq(Views.postSlug, postSlug))
        return views[0]?.count || 0;
      } catch (e) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Error getting view count for post with slug ${postSlug}`
        })
      }
    }
  }),

  incViews: defineAction({
    input: z.object({
      postSlug: z.string(),
    }),
    handler: async ({ postSlug }, { request }) => {
      const isPrerender = request.headers.get("astro-referrer")
      if (isPrerender) return;
      try {
        return await db
          .insert(Views)
          .values({ postSlug })
          .onConflictDoUpdate({
            target: Views.postSlug,
            set: { count: sql`count + 1` },
          })
          .returning()
      } catch (e) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Error incrementing view count for post with slug ${postSlug}`
        })
      }
    }
  }),
}
