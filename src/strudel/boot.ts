import { reify, Cyclist, silence, stack } from "@strudel/core";

import {
  initAudioOnFirstClick,
  getAudioContext,
  webaudioOutput,
  registerSynthSounds,
  samples,
} from "@strudel/webaudio";

import { miniAllStrings } from "@strudel/mini";
import { Bindings } from "../parser/API";

initAudioOnFirstClick();
const ctx = getAudioContext();
registerSynthSounds();

// Default Strudel samples
const ds = "https://raw.githubusercontent.com/felixroos/dough-samples/main";
samples(`${ds}/tidal-drum-machines.json`);
samples(`${ds}/piano.json`);
samples(`${ds}/Dirt-Samples.json`);
samples(`${ds}/EmuSP12.json`);
samples(`${ds}/vcsl.json`);
miniAllStrings();

function getTime() {
  return ctx.currentTime;
}

async function onTrigger(hap, deadline, duration, cps) {
  try {
    if (!hap.context.onTrigger || !hap.context.dominantTrigger) {
      await webaudioOutput(hap, deadline, duration, cps);
    }
    if (hap.context.onTrigger) {
      // call signature of output / onTrigger is different...
      await hap.context.onTrigger(getTime() + deadline, hap, getTime(), cps);
    }
  } catch (err) {
    console.log(`[cyclist] error: ${err.message}`, "error");
  }
}

const scheduler = new Cyclist({
  getTime,
  onTrigger,
});

scheduler.setPattern(silence);
scheduler.start();

export function hush() {
  scheduler.setPattern(silence);
}

// Pattern Map
let patMap = new Map();

// Curried form
export function p(id: string | number) {
  return (pattern) => ({
    runIO: () => {
      let pat = reify(pattern);
      patMap.set(id, pat);

      scheduler.setPattern(stack(...patMap.values()));

      return pat;
    },
  });
}

// Bindings (similar to Tidal's BootTidal.hs)
export const boot: Bindings = {
  p: { type: "ID -> Pattern Controls -> IO Unit", value: p },
  d1: { type: "Pattern Controls -> IO Unit", value: p(1) },
  d2: { type: "Pattern Controls -> IO Unit", value: p(2) },
  d3: { type: "Pattern Controls -> IO Unit", value: p(3) },
  d4: { type: "Pattern Controls -> IO Unit", value: p(4) },
  d5: { type: "Pattern Controls -> IO Unit", value: p(5) },
  d6: { type: "Pattern Controls -> IO Unit", value: p(6) },
  d7: { type: "Pattern Controls -> IO Unit", value: p(7) },
  d8: { type: "Pattern Controls -> IO Unit", value: p(8) },
  d9: { type: "Pattern Controls -> IO Unit", value: p(9) },
  d10: { type: "Pattern Controls -> IO Unit", value: p(10) },
  d11: { type: "Pattern Controls -> IO Unit", value: p(11) },
  d12: { type: "Pattern Controls -> IO Unit", value: p(12) },
  hush: { type: "IO Unit", value: { runIO: hush } },
};