import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const schemaUrl = "https://core.telegram.org/schema/json";
const response = await fetch(schemaUrl);
if (!response.ok) throw new Error(`Telegram schema request failed: ${response.status}`);

const schema = await response.json();
if (!Array.isArray(schema.methods)) throw new Error("Telegram schema did not contain a methods list");

const methods = schema.methods.map(({ id, method, params, type }) => ({
  id,
  method,
  params,
  type,
}));
const outputPath = fileURLToPath(new URL("../telegram-methods.json", import.meta.url));
await writeFile(outputPath, `${JSON.stringify(methods, null, 2)}\n`);
console.log(`Wrote ${methods.length} Telegram API methods to telegram-methods.json`);