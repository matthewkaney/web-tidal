import { controls as strudelControls } from "@strudel/core";
import { Bindings } from "../compiler/parse/API";

export const controls: Bindings = {
  createParam: {
    type: "String -> (Pattern a -> Pattern Controls)",
    value: strudelControls.createParam,
  },
  s: { type: "Pattern String -> Pattern Controls", value: strudelControls.s },
  sound: {
    type: "Pattern String -> Pattern Controls",
    value: strudelControls.sound,
  },
  source: { type: "", value: strudelControls.source },
  src: { type: "", value: strudelControls.src },
  n: { type: "Pattern Number -> Pattern Controls", value: strudelControls.n },
  note: {
    type: "Pattern Note -> Pattern Controls",
    value: strudelControls.note,
  },
  accelerate: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.accelerate,
  },
  gain: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.gain,
  },
  postgain: { type: "", value: strudelControls.postgain },
  amp: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.amp,
  },
  attack: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.attack,
  },
  att: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.att,
  },
  fmh: { type: "", value: strudelControls.fmh },
  fmi: { type: "", value: strudelControls.fmi },
  fm: { type: "", value: strudelControls.fm },
  fmenv: { type: "", value: strudelControls.fmenv },
  fmattack: { type: "", value: strudelControls.fmattack },
  fmdecay: { type: "", value: strudelControls.fmdecay },
  fmsustain: { type: "", value: strudelControls.fmsustain },
  fmrelease: { type: "", value: strudelControls.fmrelease },
  fmvelocity: { type: "", value: strudelControls.fmvelocity },
  bank: { type: "", value: strudelControls.bank },
  analyze: { type: "", value: strudelControls.analyze },
  fft: { type: "", value: strudelControls.fft },
  decay: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.decay,
  },
  dec: { type: "", value: strudelControls.dec },
  sustain: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.sustain,
  },
  sus: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.sus,
  },
  release: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.release,
  },
  rel: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.rel,
  },
  hold: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hold,
  },
  bandf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.bandf,
  },
  bpf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.bpf,
  },
  bp: { type: "", value: strudelControls.bp },
  bandq: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.bandq,
  },
  bpq: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.bpq,
  },
  begin: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.begin,
  },
  end: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.end,
  },
  loop: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.loop,
  },
  loopBegin: { type: "", value: strudelControls.loopBegin },
  loopb: { type: "", value: strudelControls.loopb },
  loopEnd: { type: "", value: strudelControls.loopEnd },
  loope: { type: "", value: strudelControls.loope },
  crush: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.crush,
  },
  coarse: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.coarse,
  },
  channels: { type: "", value: strudelControls.channels },
  ch: { type: "", value: strudelControls.ch },
  phaserrate: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.phaserrate,
  },
  phasr: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.phasr,
  },
  phaser: { type: "", value: strudelControls.phaser },
  ph: { type: "", value: strudelControls.ph },
  phasersweep: { type: "", value: strudelControls.phasersweep },
  phs: { type: "", value: strudelControls.phs },
  phasercenter: { type: "", value: strudelControls.phasercenter },
  phc: { type: "", value: strudelControls.phc },
  phaserdepth: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.phaserdepth,
  },
  phd: { type: "", value: strudelControls.phd },
  phasdp: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.phasdp,
  },
  channel: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.channel,
  },
  cut: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.cut,
  },
  cutoff: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.cutoff,
  },
  ctf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ctf,
  },
  lpf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lpf,
  },
  lp: { type: "", value: strudelControls.lp },
  lpenv: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lpenv,
  },
  lpe: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lpe,
  },
  hpenv: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hpenv,
  },
  hpe: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hpe,
  },
  bpenv: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.bpenv,
  },
  bpe: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.bpe,
  },
  lpattack: { type: "", value: strudelControls.lpattack },
  lpa: { type: "", value: strudelControls.lpa },
  hpattack: { type: "", value: strudelControls.hpattack },
  hpa: { type: "", value: strudelControls.hpa },
  bpattack: { type: "", value: strudelControls.bpattack },
  bpa: { type: "", value: strudelControls.bpa },
  lpdecay: { type: "", value: strudelControls.lpdecay },
  lpd: { type: "", value: strudelControls.lpd },
  hpdecay: { type: "", value: strudelControls.hpdecay },
  hpd: { type: "", value: strudelControls.hpd },
  bpdecay: { type: "", value: strudelControls.bpdecay },
  bpd: { type: "", value: strudelControls.bpd },
  lpsustain: { type: "", value: strudelControls.lpsustain },
  lps: { type: "", value: strudelControls.lps },
  hpsustain: { type: "", value: strudelControls.hpsustain },
  hps: { type: "", value: strudelControls.hps },
  bpsustain: { type: "", value: strudelControls.bpsustain },
  bps: { type: "", value: strudelControls.bps },
  lprelease: { type: "", value: strudelControls.lprelease },
  lpr: { type: "", value: strudelControls.lpr },
  hprelease: { type: "", value: strudelControls.hprelease },
  hpr: { type: "", value: strudelControls.hpr },
  bprelease: { type: "", value: strudelControls.bprelease },
  bpr: { type: "", value: strudelControls.bpr },
  ftype: { type: "", value: strudelControls.ftype },
  fanchor: { type: "", value: strudelControls.fanchor },
  vib: { type: "", value: strudelControls.vib },
  vibrato: { type: "", value: strudelControls.vibrato },
  v: { type: "", value: strudelControls.v },
  noise: { type: "", value: strudelControls.noise },
  vibmod: { type: "", value: strudelControls.vibmod },
  vmod: { type: "", value: strudelControls.vmod },
  hcutoff: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hcutoff,
  },
  hpf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hpf,
  },
  hp: { type: "", value: strudelControls.hp },
  hresonance: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hresonance,
  },
  hpq: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hpq,
  },
  resonance: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.resonance,
  },
  lpq: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lpq,
  },
  djf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.djf,
  },
  delay: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.delay,
  },
  delayfeedback: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.delayfeedback,
  },
  delayfb: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.delayfb,
  },
  dfb: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.dfb,
  },
  delaytime: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.delaytime,
  },
  delayt: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.delayt,
  },
  dt: { type: "Pattern Number -> Pattern Controls", value: strudelControls.dt },
  lock: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lock,
  },
  detune: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.detune,
  },
  det: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.det,
  },
  dry: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.dry,
  },
  fadeTime: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.fadeTime,
  },
  fadeOutTime: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.fadeOutTime,
  },
  fadeInTime: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.fadeInTime,
  },
  freq: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.freq,
  },
  pattack: { type: "", value: strudelControls.pattack },
  patt: { type: "", value: strudelControls.patt },
  pdecay: { type: "", value: strudelControls.pdecay },
  pdec: { type: "", value: strudelControls.pdec },
  psustain: { type: "", value: strudelControls.psustain },
  psus: { type: "", value: strudelControls.psus },
  prelease: { type: "", value: strudelControls.prelease },
  prel: { type: "", value: strudelControls.prel },
  penv: { type: "", value: strudelControls.penv },
  pcurve: { type: "", value: strudelControls.pcurve },
  panchor: { type: "", value: strudelControls.panchor },
  gate: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.gate,
  },
  gat: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.gat,
  },
  leslie: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.leslie,
  },
  lrate: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lrate,
  },
  lsize: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lsize,
  },
  activeLabel: { type: "", value: strudelControls.activeLabel },
  label: { type: "", value: strudelControls.label },
  degree: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.degree,
  },
  mtranspose: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.mtranspose,
  },
  ctranspose: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ctranspose,
  },
  harmonic: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.harmonic,
  },
  stepsPerOctave: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.stepsPerOctave,
  },
  octaveR: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.octaveR,
  },
  nudge: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.nudge,
  },
  octave: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.octave,
  },
  orbit: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.orbit,
  },
  overgain: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.overgain,
  },
  overshape: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.overshape,
  },
  pan: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.pan,
  },
  panspan: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.panspan,
  },
  pansplay: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.pansplay,
  },
  panwidth: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.panwidth,
  },
  panorient: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.panorient,
  },
  rate: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.rate,
  },
  slide: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.slide,
  },
  semitone: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.semitone,
  },
  voice: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.voice,
  },
  chord: {
    type: "Pattern String -> Pattern Controls",
    value: strudelControls.chord,
  },
  dictionary: { type: "", value: strudelControls.dictionary },
  dict: { type: "", value: strudelControls.dict },
  anchor: { type: "", value: strudelControls.anchor },
  offset: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.offset,
  },
  octaves: { type: "", value: strudelControls.octaves },
  mode: { type: "", value: strudelControls.mode },
  room: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.room,
  },
  roomlp: { type: "", value: strudelControls.roomlp },
  rlp: { type: "", value: strudelControls.rlp },
  roomdim: { type: "", value: strudelControls.roomdim },
  rdim: { type: "", value: strudelControls.rdim },
  roomfade: { type: "", value: strudelControls.roomfade },
  rfade: { type: "", value: strudelControls.rfade },
  ir: { type: "", value: strudelControls.ir },
  iresponse: { type: "", value: strudelControls.iresponse },
  roomsize: { type: "", value: strudelControls.roomsize },
  size: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.size,
  },
  sz: { type: "Pattern Number -> Pattern Controls", value: strudelControls.sz },
  rsize: { type: "", value: strudelControls.rsize },
  shape: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.shape,
  },
  compressor: { type: "", value: strudelControls.compressor },
  compressorKnee: { type: "", value: strudelControls.compressorKnee },
  compressorRatio: { type: "", value: strudelControls.compressorRatio },
  compressorAttack: { type: "", value: strudelControls.compressorAttack },
  compressorRelease: { type: "", value: strudelControls.compressorRelease },
  speed: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.speed,
  },
  unit: {
    type: "Pattern String -> Pattern Controls",
    value: strudelControls.unit,
  },
  squiz: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.squiz,
  },
  vowel: {
    type: "Pattern String -> Pattern Controls",
    value: strudelControls.vowel,
  },
  waveloss: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.waveloss,
  },
  density: { type: "", value: strudelControls.density },
  dur: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.dur,
  },
  expression: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.expression,
  },
  sustainpedal: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.sustainpedal,
  },
  tremolodepth: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.tremolodepth,
  },
  tremdp: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.tremdp,
  },
  tremolorate: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.tremolorate,
  },
  tremr: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.tremr,
  },
  fshift: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.fshift,
  },
  fshiftnote: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.fshiftnote,
  },
  fshiftphase: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.fshiftphase,
  },
  triode: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.triode,
  },
  krush: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.krush,
  },
  kcutoff: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.kcutoff,
  },
  octer: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.octer,
  },
  octersub: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.octersub,
  },
  octersubsub: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.octersubsub,
  },
  ring: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ring,
  },
  ringf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ringf,
  },
  ringdf: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ringdf,
  },
  distort: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.distort,
  },
  freeze: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.freeze,
  },
  xsdelay: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.xsdelay,
  },
  tsdelay: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.tsdelay,
  },
  real: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.real,
  },
  imag: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.imag,
  },
  enhance: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.enhance,
  },
  partials: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.partials,
  },
  comb: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.comb,
  },
  smear: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.smear,
  },
  scram: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.scram,
  },
  binshift: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.binshift,
  },
  hbrick: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hbrick,
  },
  lbrick: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lbrick,
  },
  midichan: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.midichan,
  },
  control: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.control,
  },
  ccn: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ccn,
  },
  ccv: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ccv,
  },
  polyTouch: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.polyTouch,
  },
  midibend: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.midibend,
  },
  miditouch: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.miditouch,
  },
  ctlNum: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.ctlNum,
  },
  frameRate: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.frameRate,
  },
  frames: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.frames,
  },
  hours: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.hours,
  },
  midicmd: {
    type: "Pattern String -> Pattern Controls",
    value: strudelControls.midicmd,
  },
  minutes: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.minutes,
  },
  progNum: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.progNum,
  },
  seconds: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.seconds,
  },
  songPtr: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.songPtr,
  },
  uid: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.uid,
  },
  val: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.val,
  },
  cps: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.cps,
  },
  clip: { type: "", value: strudelControls.clip },
  zrand: { type: "", value: strudelControls.zrand },
  curve: { type: "", value: strudelControls.curve },
  deltaSlide: { type: "", value: strudelControls.deltaSlide },
  pitchJump: { type: "", value: strudelControls.pitchJump },
  pitchJumpTime: { type: "", value: strudelControls.pitchJumpTime },
  lfo: {
    type: "Pattern Number -> Pattern Controls",
    value: strudelControls.lfo,
  },
  repeatTime: { type: "", value: strudelControls.repeatTime },
  znoise: { type: "", value: strudelControls.znoise },
  zmod: { type: "", value: strudelControls.zmod },
  zcrush: { type: "", value: strudelControls.zcrush },
  zdelay: { type: "", value: strudelControls.zdelay },
  tremolo: { type: "", value: strudelControls.tremolo },
  zzfx: { type: "", value: strudelControls.zzfx },
  createParams: { type: "", value: strudelControls.createParams },
  adsr: { type: "", value: strudelControls.adsr },
  ad: { type: "", value: strudelControls.ad },
  ds: { type: "", value: strudelControls.ds },
};
