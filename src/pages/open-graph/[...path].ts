import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const blogCollection = await getCollection("blog");

const posts = Object.fromEntries(blogCollection.map(({ id, data }) => [id, data]));

export const { getStaticPaths, GET } = OGImageRoute({
  param: "path",
  pages: posts,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[0, 0, 0]],
    logo: {
      path: './src/pages/open-graph/_images/logo.png',
      size: [225]
    },
    fonts: [
      "./src/pages/open-graph/_fonts/Geist/static/Geist-Regular.ttf",
      "./src/pages/open-graph/_fonts/Geist/static/Geist-Bold.ttf",
    ],
    border: {
      color: [54, 54, 54],
      width: 10,
    },
    font: {
      title: {
        color: [254, 128, 25],
        weight: "Bold",
        families: ["Geist"]
      },
      description: {
        color: [160, 160, 160],
        families: ["Geist"]
      }
    }
  }),
});
