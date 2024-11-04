import { render, createContext } from "preact";
import { useContext } from "preact/hooks";

interface Span {
  begin: number;
  end: number;
}

interface ScaleSpec {
  span: Span;
  canvas: { horiz: Span; vert: Span };
}

const Scale = createContext<ScaleSpec>({
  span: { begin: 0, end: 1 },
  canvas: { horiz: { begin: 20, end: 480 }, vert: { begin: 20, end: 80 } },
});

export interface PatternDiagram {
  dom: HTMLDivElement;
  setPattern: (pat: any) => void;
}

export function makePatternDiagram(): PatternDiagram {
  let dom = document.createElement("div");

  const setPattern = (pat: any) => {
    render(<Diagram pattern={pat} />, dom);
  };

  return { dom, setPattern };
}

interface DiagramHaps {
  pattern: any;
}

function Diagram({ pattern }: DiagramHaps) {
  const {
    span: { begin, end },
  } = useContext(Scale);
  const haps = pattern.queryArc(begin, end);

  return (
    <svg width="500" height="100">
      <Background />
      {haps.map(({ whole, part, value }: any) => (
        <Hap
          whole={whole}
          part={part}
          label={typeof value === "string" ? value : value.toString()}
        />
      ))}
    </svg>
  );
}

function Background() {
  const {
    canvas: { vert, horiz },
  } = useContext(Scale);

  return (
    <rect
      x={horiz.begin}
      y={vert.begin}
      width={length(horiz)}
      height={length(vert)}
      fill="#ffffff22"
      stroke="none"
    ></rect>
  );
}

interface HapProps {
  whole?: Span;
  part: Span;
  label: string;
}

function Hap({ whole, part, label }: HapProps) {
  const {
    span,
    canvas: { horiz, vert },
  } = useContext(Scale);
  const { begin, end } = part;

  console.log(whole);
  console.log(part);

  const x1 = map(begin, span, horiz);
  const x2 = map(end, span, horiz);

  const { begin: y1, end: y2 } = vert;

  // @ts-ignore
  let hasOnset = begin.equals(whole?.begin);
  // @ts-ignore
  let hasOffset = end.equals(whole?.end);

  return (
    <>
      <rect
        x={x1}
        y={y1}
        width={x2 - x1}
        height={length(vert)}
        fill={hasOnset ? "#ffffff33" : "none"}
        stroke="none"
      ></rect>
      {hasOnset && (
        <line
          x1={x1 + 1.5}
          y1={y1}
          x2={x1 + 1.5}
          y2={y2}
          stroke="#fff"
          stroke-width="3"
        ></line>
      )}
      <text
        x={x1 + (x2 - x1) * 0.5}
        y={vert.begin + length(vert) * 0.5}
        fill="white"
        text-anchor="middle"
      >
        {label}
      </text>
    </>
  );
}

function length({ begin, end }: Span) {
  return end - begin;
}

function map(value: number, span1: Span, span2: Span) {
  return ((value - span1.begin) / length(span1)) * length(span2) + span2.begin;
}
