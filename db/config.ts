import { column, defineDb, defineTable } from "astro:db";

const Views = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postSlug: column.text({ unique: true }),
    count: column.number({ default: 1 }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Views },
});
