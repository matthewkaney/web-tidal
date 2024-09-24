import { Token } from "../scan/Token";
import { Expr } from "../parse/Expr";

import {
  generalise,
  instantiate,
  makeSubstitution,
  newTypeVar,
  Substitution,
  unify,
} from "./Utilities";
import { TypeChecker as TC, Context, makeContext, MonoType } from "./Types";
import { TokenType } from "../scan/TokenType";
import {
  TypeAnnotation,
  TypeInfo,
  MissingTypeWarning,
  UnificationError,
  ApplicationError,
} from "./Annotations";

export const W = (
  typEnv: Context,
  expr: Expr
): [Substitution, MonoType | null, TypeAnnotation[]] => {
  switch (expr.type) {
    case Expr.Type.Variable: {
      const value = typEnv[expr.name.lexeme];
      if (value === undefined) {
        // TODO: attach source position to this
        //throw new Error(`Undefined variable: ${expr.name.lexeme}`);
        let newType = newTypeVar();
        return [
          makeSubstitution({}),
          newType,
          [new MissingTypeWarning(expr, newType)],
        ];
      }
      const type = instantiate(value);
      return [makeSubstitution({}), type, [new TypeInfo(expr, type)]];
    }
    case Expr.Type.Literal:
      switch (typeof expr.value) {
        case "string": {
          const type: MonoType = {
            type: TC.Type.TyCon,
            C: "Pattern",
            mus: [newTypeVar()],
          };
          return [makeSubstitution({}), type, [new TypeInfo(expr, type)]];
        }
        case "number": {
          const type: MonoType = {
            type: TC.Type.TyCon,
            C: "Pattern",
            mus: [{ type: TC.Type.TyCon, C: "Number", mus: [] }],
          };
          return [makeSubstitution({}), type, [new TypeInfo(expr, type)]];
        }
        case "boolean": {
          const type: MonoType = { type: TC.Type.TyCon, C: "Boolean", mus: [] };
          return [makeSubstitution({}), type, [new TypeInfo(expr, type)]];
        }
      }
    case Expr.Type.Grouping:
      return W(typEnv, expr.expression);

    case Expr.Type.Application: {
      const [substitution, type, annotations] = InferTypeApp(
        typEnv,
        expr.left,
        expr.right
      );
      return [
        substitution,
        type,
        annotations.concat([new TypeInfo(expr, type)]),
      ];
    }

    case Expr.Type.Binary: {
      const [substitution, type, annotations] = InferTypeApp(
        typEnv,
        Expr.Application(Expr.Variable(expr.operator), expr.left),
        expr.right
      );

      return [
        substitution,
        type,
        annotations.concat([new TypeInfo(expr, type)]),
      ];
    }

    case Expr.Type.Section: {
      // TODO: This is likely, but not necessarily, a unique name. A better
      //       implementation would use a separate renaming step like GHC.
      const x = (Math.random() + 1).toString(36).substring(7);
      const xExp = Expr.Variable(new Token(TokenType.Identifier, x, null, 0));

      // A section is just a binary operation wrapped in a function abstraction. One of the
      // sides of the operator is the variable from the abstraction
      let left = expr.side === "left" ? xExp : expr.expression;
      let right = expr.side === "right" ? xExp : expr.expression;

      // TODO: Does it matter that this binary expression has a made-up precedence?
      const [substitution, type, annotations] = InferTypeAbs(
        typEnv,
        x,
        Expr.Binary(left, expr.operator, right, 0)
      );
      return [
        substitution,
        type,
        annotations.concat([new TypeInfo(expr, type)]),
      ];
    }

    case Expr.Type.List:
      // Desugar to a right-associative set of cons operators
      return W(
        typEnv,
        expr.items.reduceRight(
          (prev, item) =>
            Expr.Binary(
              item,
              new Token(TokenType.Identifier, ":", null, 0),
              prev,
              0
            ),
          Expr.Variable(new Token(TokenType.Identifier, "[]", null, 0))
        )
      );

    case Expr.Type.Assignment:
    case Expr.Type.Unary:
    case Expr.Type.Empty:
      throw new Error(`Unhandled expression type: ${expr.type}`);

    default:
      return expr satisfies never;
  }
};

function InferTypeAbs(
  typeEnv: Context,
  x: string,
  expr: Expr
): [Substitution, MonoType | null, TypeAnnotation[]] {
  const beta = newTypeVar();
  const [s1, t1, a1] = W(
    makeContext({
      ...typeEnv,
      [x]: beta,
    }),
    expr
  );

  return [
    s1,
    t1
      ? s1({
          type: TC.Type.FnType,
          in: beta,
          out: t1,
        })
      : null,
    a1,
  ];
}

function InferTypeApp(
  typeEnv: Context,
  expr1: Expr,
  expr2: Expr
): [Substitution, MonoType | null, TypeAnnotation[]] {
  const [s1, t1, a1] = W(typeEnv, expr1);
  const [s2, t2, a2] = W(s1(typeEnv), expr2);
  const beta = newTypeVar();

  const a3 = a1.concat(a2);

  if (t1 && t2) {
    const s3 = unify(s2(t1), {
      type: TC.Type.FnType,

      in: t2,
      out: beta,
    });

    if (s3) {
      a3.forEach((annotation) => {
        annotation.apply(s3);
      });

      return [s3(s2(s1)), s3(beta), a3];
    } else {
      let fType = s2(t1);

      if (fType.type === TC.Type.FnType) {
        a3.push(new UnificationError(expr2, fType.in, t2));
      } else {
        a3.push(new ApplicationError(expr2));
      }

      return [s2(s1), null, a3];
    }
  }

  return [s1, null, a3];
}

// TODO: Implement Let
// case "Core_Let": {
//   const [s1, t1] = W(typEnv, expr.e1);
//   const [s2, t2] = W(
//     makeContext({
//       ...s1(typEnv),
//       [expr.x]: generalise(typEnv, t1),
//     }),
//     expr.e2
//   );
//   return [s2(s1), t2];
// }
