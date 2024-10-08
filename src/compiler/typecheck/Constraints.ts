import { Expr } from "../parse/Expr";
import { TypeChecker as TC, Context } from "./Types";
import { newTypeVar, instantiate } from "./Utilities";

type Constraint = Constraint.Eq | Constraint.Dict;

export namespace Constraint {
  export enum Type {
    Eq = "Equality",
    Dict = "Dictionary",
  }

  interface Common {}

  export interface Eq extends Common {
    type: Type.Eq;
    lhs: TC.MonoType;
    rhs: TC.MonoType;
  }

  export interface Dict extends Common {
    type: Type.Dict;
  }
}

type TypeAnnotatedTree = Map<Expr, TC.MonoType>;

export function generateConstraints(
  expr: Expr,
  context: Context
): [TypeAnnotatedTree, Constraint[]] {
  switch (expr.type) {
    case Expr.Type.Variable: {
      const value = context[expr.name.lexeme];
      if (value === undefined) {
        throw new Error(`Undefined variable: ${expr.name.lexeme}`);
      }
      const type = instantiate(value);
      return [new Map([[expr, type]]), []];
    }

    case Expr.Type.Literal: {
      let type: TC.MonoType;
      switch (typeof expr.value) {
        case "string":
          type = {
            type: TC.Type.TyCon,
            C: "Pattern",
            mus: [newTypeVar()],
          };
          break;
        case "number":
          type = {
            type: TC.Type.TyCon,
            C: "Pattern",
            mus: [{ type: TC.Type.TyCon, C: "Number", mus: [] }],
          };
          break;
        case "boolean":
          type = { type: TC.Type.TyCon, C: "Boolean", mus: [] };
          break;
      }
      return [new Map([[expr, type]]), []];
    }

    case Expr.Type.Grouping: {
      const [types, constraints] = generateConstraints(
        expr.expression,
        context
      );
      return [
        new Map([...types, [expr, types.get(expr.expression)]]),
        constraints,
      ];
    }

    case Expr.Type.Application: {
      const [lTypes, lConstraints] = generateConstraints(expr.left, context);
      const lType = lTypes.get(expr.left);
      const [rTypes, rConstraints] = generateConstraints(expr.right, context);
      const rType = rTypes.get(expr.right);

      const type = newTypeVar(); // The return type of the expression
      return [
        new Map([...lTypes, ...rTypes, [expr, type]]),
        [
          ...lConstraints,
          ...rConstraints,
          {
            type: Constraint.Type.Eq,
            lhs: lType,
            rhs: { type: TC.Type.FnType, in: rType, out: type },
          },
        ],
      ];
    }

    case Expr.Type.Binary: {
      const [lTypes, lConstraints] = generateConstraints(expr.left, context);
      const lType = lTypes.get(expr.left);
      const [rTypes, rConstraints] = generateConstraints(expr.right, context);
      const rType = rTypes.get(expr.right);

      // TODO: Operators should be their own expression
      const oValue = context[expr.operator.lexeme];
      if (oValue === undefined) {
        throw new Error(`Undefined variable: ${expr.operator.lexeme}`);
      }
      const oType = instantiate(oValue);

      const type = newTypeVar(); // The return type of the operation

      return [
        new Map([...lTypes, ...rTypes, [expr, type]]),
        [
          ...lConstraints,
          ...rConstraints,
          {
            type: Constraint.Type.Eq,
            lhs: oType,
            rhs: {
              type: TC.Type.FnType,
              in: lType,
              out: { type: TC.Type.FnType, in: rType, out: type },
            },
          },
        ],
      ];
    }

    case Expr.Type.Section:
    // // TODO: This is likely, but not necessarily, a unique name. A better
    // //       implementation would use a separate renaming step like GHC.
    // const x = (Math.random() + 1).toString(36).substring(7);
    // const xExp = Expr.Variable(new Token(TokenType.Identifier, x, null, 0));

    // // A section is just a binary operation wrapped in a function abstraction. One of the
    // // sides of the operator is the variable from the abstraction
    // let left = expr.side === "left" ? xExp : expr.expression;
    // let right = expr.side === "right" ? xExp : expr.expression;

    // // TODO: Does it matter that this binary expression has a made-up precedence?
    // const [substitution, type, annotations] = InferTypeAbs(
    //   typEnv,
    //   x,
    //   Expr.Binary(left, expr.operator, right, 0)
    // );
    // return [
    //   substitution,
    //   type,
    //   annotations.concat([new TypeInfo(expr, type)]),
    // ];

    case Expr.Type.List:
    // // Desugar to a right-associative set of cons operators
    // return W(
    //   typEnv,
    //   expr.items.reduceRight(
    //     (prev, item) =>
    //       Expr.Binary(
    //         item,
    //         new Token(TokenType.Identifier, ":", null, 0),
    //         prev,
    //         0
    //       ),
    //     Expr.Variable(new Token(TokenType.Identifier, "[]", null, 0))
    //   )
    // );

    case Expr.Type.Assignment:
    case Expr.Type.Unary:
    case Expr.Type.Empty:
      throw new Error(`Unhandled expression type: ${expr.type}`);
    default:
      return expr satisfies never;
  }
}

export function typeEquality(type1: TC.MonoType, type2: TC.MonoType) {
  if (type1.type === TC.Type.TyVar && type2.type === TC.Type.TyVar) {
    return type1.a === type2.a;
  }

  if (type1.type === TC.Type.TyCon && type2.type === TC.Type.TyCon) {
    return (
      type1.C === type2.C &&
      type1.mus.length === type2.mus.length &&
      type1.mus.every((ty, i) => typeEquality(ty, type2.mus[i]))
    );
  }

  if (type1.type === TC.Type.FnType && type2.type === TC.Type.FnType) {
    return (
      typeEquality(type1.in, type2.in) && typeEquality(type1.out, type2.out)
    );
  }

  return false;
}

export function solveConstraint(ct: Constraint) {
  switch (ct.type) {
    case Constraint.Type.Eq:
      try {
      } catch (e) {}
      return;
    case Constraint.Type.Dict:
      // Do something
      throw new Error("Dictionary constraints aren't implemented yet");
      return;
  }
}
