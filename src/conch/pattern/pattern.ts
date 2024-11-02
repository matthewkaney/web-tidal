import { Time, Span, withSpanTime } from "./time";
import { Hap, withHapSpan } from "./hap";

type State = {
  span: Span;
};

const withStateSpan =
  (func: (span: Span) => Span) =>
  (state: State): State => ({ ...state, span: func(state.span) });

interface Pattern<T> {
  query: (state: State) => Hap<T>[];
  pulse: number;
}

// Transformations on the query
export const withQuerySpan =
  <T>(func: (span: Span) => Span) =>
  (pat: Pattern<T>): Pattern<T> => ({
    ...pat,
    query: (state) => pat.query(withStateSpan(func)(state)),
  });

export const withQueryTime = <T>(func: (t: Time) => Time) =>
  withQuerySpan<T>(withSpanTime(func));

// Transformations on the haps

export const withHap =
  <T, U = T>(func: (hap: Hap<T>) => Hap<U>) =>
  (pat: Pattern<T>): Pattern<U> => ({
    ...pat,
    query: (state) => pat.query(state).map((hap) => func(hap)),
  });

export const withSpan = <T>(func: (span: Span) => Span) =>
  withHap<T>(withHapSpan(func));

export const withTime = <T>(func: (t: Time) => Time) =>
  withSpan<T>(withSpanTime(func));

// Transformations on time
export const fast = <T>(factor: number) =>
  // if (factor === 0) {
  //   return silence;
  // }
  compose<Pattern<T>, Pattern<T>, Pattern<T>>(
    withQueryTime<T>((t) => t * factor)
  )(withTime((t) => t / factor));

export const compose =
  <A, B, C>(f: (a: A) => B) =>
  (g: (b: B) => C) =>
  (a: A) =>
    g(f(a));
