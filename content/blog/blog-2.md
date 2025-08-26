---
title: Example Blog Post
author: Aiden Olsen
description: This blog post outlines all of the features I have available when i go to create a post.
pubDate: 2025-08-26
---

# Setup

"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"

## Example code blocks

```astro title="src/components/Greet.astro"
---
interface Props {
  name?: string;
}

const { name = "Astro" } = Astro.props;
---

<p>Hello, {name}!</p>
```

## View the dev server

```zsh title="Run the Astro Development Server"
npx astro dev
```
