export type Time = number;

export interface Span {
  begin: Time;
  end: Time;
}

export const withSpanTime =
  (func: (t: Time) => Time) =>
  ({ begin, end }: Span): Span => ({ begin: func(begin), end: func(end) });
