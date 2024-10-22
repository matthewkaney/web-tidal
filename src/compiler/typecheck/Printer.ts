import { TypeChecker as TC } from "./Types";

export function printType(type: TC.PolyType) {
  throw new Error("Type printing isn't set up for qualified types yet");
}

export function printMonoType(type: TC.MonoType, parenthesize = false) {
  switch (type.type) {
    case TC.Type.TyVar:
      return type.a;
    case TC.Type.TyCon:
      if (type.mus.length === 0) return type.C;

      switch (type.C) {
        case "()":
          return `(${type.mus.map((m) => printMonoType(m)).join(", ")})`;
        default:
          return parens(
            `${type.C} ${type.mus
              .map((t) => printMonoType(t, true))
              .join(" ")}`,
            parenthesize
          );
      }
    case TC.Type.FnType:
      return parens(
        `${printMonoType(
          type.in,
          type.in.type === TC.Type.FnType
        )} -> ${printMonoType(type.out)}`,
        parenthesize
      );
    // case TC.Type.TyQuant:
    //   return parens(`forall ${type.a}. ${printMonoType(type.sigma)}`, parenthesize);
    default:
      return type satisfies never;
  }
}

function parens(text: string, parenthesize: boolean) {
  return (parenthesize ? "(" : "") + text + (parenthesize ? ")" : "");
}
