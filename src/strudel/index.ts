import {
  reify,
  Cyclist,
  silence,
  controls,
  fast,
  stack,
  when,
} from "@strudel/core";
import { miniAllStrings } from "@strudel/mini";
import {
  initAudioOnFirstClick,
  getAudioContext,
  webaudioOutput,
  registerSynthSounds,
} from "@strudel/webaudio";

initAudioOnFirstClick();
const ctx = getAudioContext();
registerSynthSounds();

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

function hush() {
  scheduler.setPattern(silence);
}

import { TokenType } from "../parser/TokenType";

// Pattern Map
let patMap = new Map();

// Curried form
function p(id: string | number) {
  return (pattern) => {
    let pat = reify(pattern);
    patMap.set(id, pat);

    scheduler.setPattern(stack(...patMap.values()));

    return pat;
  };
}

export const bindings = {
  addOne: (x: any) => x + 1,
  addAny: (...xs) => xs.reduce((x, y) => x + y, 0),
  p: (id: string | number, pattern) => p(id)(pattern),
  // TODO: Set orbits?
  d1: p(1),
  d2: p(2),
  d3: p(3),
  d4: p(4),
  d5: p(5),
  d6: p(6),
  d7: p(7),
  d8: p(8),
  d9: p(9),
  d10: p(10),
  d11: p(11),
  d12: p(12),
  ...controls,
  fast,
  when,
  silence,
  stack: (items) => stack(...items),
  hush: {
    runIO: hush,
  },
};

export const operators = {
  [TokenType.Plus]: (a, b) => reify(a).add.mix(reify(b)),
  [TokenType.Minus]: (a, b) => reify(a).sub.mix(reify(b)),
  [TokenType.Star]: (a, b) => reify(a).mul.mix(reify(b)),
  [TokenType.Slash]: (a, b) => reify(a).div.mix(reify(b)),
  [TokenType.RightSB]: (a, b) => reify(a).set.mix(reify(b)),
  [TokenType.RightSL]: (a, b) => reify(a).set.in(reify(b)),
  [TokenType.RightSR]: (a, b) => reify(a).set.out(reify(b)),
};
