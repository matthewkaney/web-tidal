import { Bindings, expandSynonyms } from "../compiler/parse/API";

export { Pattern } from "@strudel/core";

import { operators } from "./operators";
import { core } from "./core";
import { controls } from "./controls";
import { tonal } from "./tonal";
import { boot } from "./boot";
export { hush } from "./boot";

export const bindings: Bindings = expandSynonyms({
  ...operators,
  ...core,
  ...controls,
  ...boot,
  ...tonal,
});

export const typeBindings: { [name: string]: string } = Object.fromEntries(
  Object.entries(bindings).flatMap(([name, { type }]) =>
    type.length > 0 ? [[name, type]] : []
  )
);
