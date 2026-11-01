/**
 * Generates `.content-collections/generated` from content-collections.ts, so
 * `tsc` and Vitest can run on a fresh checkout before any `next build`.
 */
import { createBuilder } from "@content-collections/core";

const builder = await createBuilder("content-collections.ts");
builder.on("builder:end", ({ stats }) => {
  console.log(`content-collections: ${stats.collections} collections, ${stats.documents} documents`);
});
await builder.build();
