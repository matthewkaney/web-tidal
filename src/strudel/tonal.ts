import * as strudelTonal from "@strudel/tonal";
import { Bindings } from "../compiler/parse/API";

export const tonal: Bindings = {
  addVoicings: {
    type: "String -> [(String, [String])] -> (Note, Note) -> IO ()",
    value: (...args) => ({ runIO: () => strudelTonal.addVoicings(...args) }),
  },
  // Internal?
  registerVoicings: { type: "", value: strudelTonal.registerVoicings },
  rootNotes: {
    type: "Pattern Number -> Pattern Note -> Pattern Note",
    value: strudelTonal.rootNotes,
  },
  scale: {
    type: "Pattern String -> Pattern Controls -> Pattern Controls",
    value: strudelTonal.scale,
  },
  scaleTranspose: {
    type: "Pattern Number -> Pattern Controls -> Pattern Controls",
    value: strudelTonal.scaleTranspose,
  },
  // Internal?
  setVoicingRange: { type: "", value: strudelTonal.setVoicingRange },
  // Pattern Interval really, but it doesn't really matter
  transpose: {
    type: "Pattern Note -> Pattern Controls -> Pattern Controls",
    value: strudelTonal.transpose,
  },
  voicing: {
    type: "Pattern Controls -> Pattern Controls",
    value: strudelTonal.voicing,
  },
  // Internal?
  voicingAlias: { type: "", value: strudelTonal.voicingAlias },
  // Internal?
  voicingRegistry: { type: "", value: strudelTonal.voicingRegistry },
  // Deprecated
  voicings: {
    type: "String -> Pattern String -> Pattern Note",
    value: strudelTonal.voicings,
  },
};
