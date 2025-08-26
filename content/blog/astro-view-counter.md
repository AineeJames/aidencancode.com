---
title: How to create a view counter in Astro using SSG and client Islands
author: Aiden Olsen
description: Learn how to implement a reactive view counter for your Astro blog.
pubDate: 2025-08-26
---

# Introduction

I am new to Astro, and when it came to implementing a view counter for this blog, I was confused by old
tutorials. My intuition was to use Astro's [server islands](https://docs.astro.build/en/guides/server-islands/)
like so: `<ViewCount increment server:defer />` to defer the component's rendering to the server. The problem is astro
automatically adds the following into any page that uses a **server-side island** component:

```astro title="src/layouts/Layout.astro" ins={3}
<html>
  <head>
    <link rel="preload" as="fetch" href="/_server-islands/ViewCounter" crossorigin="anonymous" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

On Chrome (and probably some other browsers too), this method actuially worked just fine. It wasn't until I pulled out
my phone to check on Safari that I noticed the views incrememneted **twice**. This is what let me to the discovery I mentioned
above.

While prefetching is important, I couldn't find a way to disable this behavior easily through the Astro docs. Therefore, I landed on
the **client-side island** approach while still allowing me to use SSG.

# Implementation

I'll try to keep this implementation example very simple &mdash; only adding the necessary code. I also will try to use the current
best practices when working in an Astro project.

The first step is to _init_ our project (if you aren't already working in one):

```zsh title="Project Setup"
# create a new project if needed
npm create astro@latest <project-name> && cd <project-name>

# necessary to create the table to store counts
npx astro add db

# add the UI integration you prefer
npx astro add svelte
```

## Database configuration

Now that we have our project initialized and our database integrastion setup, we can move on to our first step: defining our db schema.
[Astro DB](https://docs.astro.build/en/guides/astro-db/) allows us to easily define database schemas in the auto generated `db/config.ts` file:

```ts title="db/config.ts"
import { column, defineDb, defineTable } from "astro:db";

// Views holds view counts for a given slug (aka blog post)
const Views = defineTable({
  slug: column.text({ unique: true }),
  count: column.number({ default: 1 }),
});

export default defineDb({
  tables: { Views },
});
```

## Defining actions

[Astro Actions](https://docs.astro.build/en/guides/actions/) allow us to define reusable pieces of code that we can call from out components.

```ts title="src/actions/index.ts"
import { ActionError } from "astro/actions/runtime/virtual/shared.js";
import { defineAction } from "astro:actions";
import { db, eq, sql, Views } from "astro:db";
import { z } from "astro:schema";

export const server = {
  pageViews: {
    // Action to fetch the view count for a given slug
    get: defineAction({
      input: z.string(),
      handler: async (slug) => {
        try {
          const views = await db
            .select()
            .from(Views)
            .where(eq(Views.slug, slug));
          return views[0]?.count || 0; // Default to 0 if you're the first to view
        } catch (e) {
          console.error(e);
          throw new ActionError({
            code: "BAD_REQUEST",
            message: `Failed to fetch view count for slug: ${slug}`,
          });
        }
      },
    }),

    // Action to increment the view count for a given slug
    inc: defineAction({
      input: z.string(),
      handler: async (slug) => {
        try {
          await db
            .insert(Views)
            .values({ slug })
            .onConflictDoUpdate({
              // If row already exists then add one to count
              target: Views.slug,
              set: { count: sql`count + 1` },
            });
        } catch (e) {
          console.error(e);
          throw new ActionError({
            code: "BAD_REQUEST",
            message: `Failed to incrememnt view count for slug: ${slug}`,
          });
        }
      },
    }),
  },
};
```

## Declaring our component

I am going to use [Svelte](https://svelte.dev/) for this, buy you can use any supported UI integration that Astro supports. I want this component
to increment only when the `incremement` boolean prop is passed and render the view count after it is fetched.

```svelte title="src/components/ViewCount.astro"
<script lang="ts">
  import { actions } from "astro:actions";

  interface Props {
    slug: string;
    increment?:
  }

  const { slug, increment = false. ...restProps }: Props = $props();

  let viewCount = $state<string | null>(null);

  $effect(() => {
    const { data, error } = await actions.pageViews.get(slug);
    if (error) console.error(error);
    viewCount = data?.toLocaleString() || "?";

    if (increment) {
      const { error } = await actions.pageViews.inc(slug);
      if (error) console.error("Failed to increment page view...");
    }
  });
</script>

<span {...restProps}>
  {viewCount ?? "…"}
</span>
```

## Using our component

Now we can use our new component like so inside of the blog post:

```astro title="src/pages/blog/[...slug].astro" "client:load"
---
import ViewCount from "../components/ViewCount.svelte";
// Rest of post code here...
---

<Layout>
  <p><ViewCount {slug} increment client:load /> Views</p>
</Layout>
```

**NOTE:** We must are using the `client:load` island directive to tell Astro to hydrate the islang at load time since
we want to get our count value ASAP.

We can also reuse this component in out blog listing page by omitting the `increment` flag:

```astro title="src/pages/blog/index.astro"
---
import { getCollection } from "astro:content";
import ViewCount from "../components/ViewCount.svelte";

const posts = await getCollection("blog");
---

<Layout>
  {posts.map((post: CollectionEntry<"blog">) => (
    <a href={`blog/${post.id}`}>{post.data.title}</a>
    <p><ViewCount {slug} client:load /> Views</p>
  ));}
</Layout>
```

# Conclusion

Well, there we have it!
