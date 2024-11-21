import { Type } from "./Type";
import { QualType } from "./TypeClass";
import { TypeScheme } from "./TypeScheme";

import { asFnType } from "./BuiltIns";
import { Substitution } from "./Substitution";

export function printSubstitution(sub: Substitution) {
  return Object.entries(sub)
    .map(([tVar, type]) => `${tVar} |-> ${printType(type, true)}`)
    .join("\n");
}

export function printQualType({ preds, type }: QualType) {
  if (preds.length === 0) {
    return printType(type);
  }

  const context = parens(
    preds
      .map(({ isIn, type }) => `${isIn} ${printType(type, true)}`)
      .join(", "),
    preds.length > 1
  );

  return `${context} => ${printType(type)}`;
}

export function printType(type: Type, parenthesize = false): string {
  switch (type.is) {
    case Type.Is.Var:
    case Type.Is.Const:
      return type.id;
    case Type.Is.App:
      let left: Type, right: Type;
      const fnType = asFnType(type);

      if (fnType) {
        ({ left, right } = fnType);
        return parens(
          `${printType(left, !!asFnType(left))} -> ${printType(right)}`,
          parenthesize
        );
      } else {
        ({ left, right } = type);
        return parens(
          `${printType(left)} ${printType(right, true)}`,
          parenthesize
        );
      }
    case Type.Is.Gen:
      return `<t${type.num}>`;
    default:
      return type satisfies never;

    // case "ty-quantifier":
    //   return parens(`forall ${type.a}. ${printType(type.sigma)}`, parenthesize);
    // case "ty-lit":
    //   return `<${type.litType === "string" ? "String" : "Numeric"} Literal>`;
  }
}

function parens(text: string, parenthesize: boolean) {
  return (parenthesize ? "(" : "") + text + (parenthesize ? ")" : "");
}
