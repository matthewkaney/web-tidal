import { Span } from "./time";

export interface Hap<T> {
  whole: Span;
  part: Span;
  value: T;
  context: object;
}

export const withHapSpan =
  <T>(func: (span: Span) => Span) =>
  (hap: Hap<T>) => ({
    ...hap,
    whole: hap.whole && func(hap.whole),
    part: func(hap.part),
  });
