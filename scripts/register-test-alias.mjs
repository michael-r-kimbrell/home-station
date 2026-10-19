import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./test-alias-hook.mjs", import.meta.url);
