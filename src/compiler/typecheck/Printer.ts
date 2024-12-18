import { PolyType } from "./Types";

export function printType(type: PolyType, parenthesize = false): string {
  switch (type.type) {
    case "ty-var":
      return type.a;
    case "ty-app":
      if (type.mus.length === 0) return type.C;

      switch (type.C) {
        case "->":
          return parens(
            `${printType(
              type.mus[0],
              type.mus[0].type === "ty-app" && type.mus[0].C === "->"
            )} -> ${printType(type.mus[1])}`,
            parenthesize
          );
        case "()":
          return `(${type.mus.map((m) => printType(m)).join(", ")})`;
        default:
          return parens(
            `${type.C} ${type.mus.map((t) => printType(t, true)).join(" ")}`,
            parenthesize
          );
      }
    case "ty-quantifier":
      return parens(`forall ${type.a}. ${printType(type.sigma)}`, parenthesize);
    case "ty-lit":
      return `<${type.litType === "string" ? "String" : "Numeric"} Literal>`;
  }
}

function parens(text: string, parenthesize: boolean) {
  return (parenthesize ? "(" : "") + text + (parenthesize ? ")" : "");
}
