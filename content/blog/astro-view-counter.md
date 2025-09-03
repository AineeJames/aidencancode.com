---
title: How to create a view counter in Astro using SSG and client Islands
author: Aiden Olsen
description: Learn how to implement a reactive view counter for your Astro blog.
pubDate: 2025-08-26
---

# Introduction

I am new to Astro, and when it came to implementing a view counter for this blog, I was confused by old
tutorials. My intuition was to use Astro's [server islands](https://docs.astro.build/en/guides/server-islands/)
like so: `<ViewCounter server:defer />` to defer the component's rendering to the server. The problem is that Astro
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

On Chrome (and probably some other browsers too), this is actually just fine. However, when I pulled out
my phone to check on Safari, I noticed that the views incremented **twice**. This is what let me to discover what I mentioned
above.

While prefetching is important and good for client performance, I couldn't find a way to disable this behavior easily through the
Astro docs. Therefore, I landed on using a **client-side island** approach which still allows me to use [SSG](https://en.wikipedia.org/wiki/Static_site_generator).

# Implementation

I'll try to keep this implementation example very simple &mdash; only adding and showing necessary code following the current best practices
in Astro.

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

Now that we have our project initialized and our database integration setup, we can move on to our first step: **defining the db schema**.
[Astro DB](https://docs.astro.build/en/guides/astro-db/) allows us to easily define database schemas in the `db/config.ts` file:

```ts title="db/config.ts"
import { column, defineDb, defineTable } from "astro:db";

const Views = defineTable({
  slug: column.text({ unique: true }),
  count: column.number({ default: 1 }),
});

export default defineDb({
  tables: { Views },
});
```

### Explanation of code:

- `defineTable`: creates a new table schema using the `column` import. Here we also set the slug to be the primary key and default the count
  to 1.

- Add the new `Views` table to the database tables.

## Defining actions

[Astro Actions](https://docs.astro.build/en/guides/actions/) allow us to define reusable pieces of code that we can call from out components.
The following code block defines our queries to get and increment the view count for a given page. We also can throw `ActionError`'s that we
can handle later on in our components.

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

Astro DB uses [Drizzle ORM](https://orm.drizzle.team/) for queriying. Check out the docs if you need help understanding how the
database function chaining works.

## Declaring our component

I am going to use [Svelte](https://svelte.dev/) for this, but you can use any supported UI integration that Astro supports.

In order to get the view count for a specific post, we need to include the `slug` as a prop. I also want this component to
increment only when the `increment` boolean prop is passed.

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

Now that we have created our component, we can include it within our pages:

```astro title="src/pages/blog/[...slug].astro" "client:load"
---
import ViewCount from "../components/ViewCount.svelte";
// Rest of post code here...
---

<Layout>
  <p><ViewCount {slug} increment client:load /> Views</p>
</Layout>
```

> ### NOTE
>
> - We are using the `client:load` island directive to tell Astro to hydrate the island at load time.
>   We use this since we want to fetch our view count **ASAP**!

We can reuse this component in our blog listing page by omitting the `increment` flag when adding the component:

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

Pretty sweet, huh!

# Conclusion

Using Astro Actions, Astro DB, and client islands with Svelte we were able to create a simple yet effective solution for
tracking blog views. The client side approach can feel roundabout at times, but until `server:defer` is better documented,
this will have to do.

Please leave a comment and happy coding!
