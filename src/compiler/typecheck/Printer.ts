import { TypeChecker as TC, PolyType } from "./Types";

export function printType(type: PolyType, parenthesize = false) {
  switch (type.type) {
    case TC.Type.TyVar:
      return type.a;
    case TC.Type.TyCon:
      if (type.mus.length === 0) {
        return type.C;
      } else {
        return parens(
          `${type.C} ${type.mus.map((t) => printType(t, true)).join(" ")}`,
          parenthesize
        );
      }
    case TC.Type.FnType:
      return parens(
        `${printType(type.in, type.in.type === TC.Type.FnType)} -> ${printType(
          type.out
        )}`,
        parenthesize
      );
    case TC.Type.TyQuant:
      return parens(`forall ${type.a}. ${printType(type.sigma)}`, parenthesize);
    default:
      return type satisfies never;
  }
}

function parens(text: string, parenthesize: boolean) {
  return (parenthesize ? "(" : "") + text + (parenthesize ? ")" : "");
}
