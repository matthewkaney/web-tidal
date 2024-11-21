import { Expr } from "../parse/AST/Expr";

import { Kind } from "./Type";

import { TypeInf, freshInst, unify } from "./Monad";
import { TypeEnv } from "./environment/TypeEnv";
import { Predicate } from "./TypeClass";
import { TypeInfo, getType } from "./Annotations";
import { KType, KFunc, TConst, TFunc, TApp } from "./BuiltIns";
import { TokenType } from "../scan/TokenType";

export function inferLit(
  expr: Expr.Literal
): TypeInf<[Predicate[], Expr<TypeInfo>]> {
  const typeClass =
    expr.token.type === TokenType.String ? "FromString" : "FromNumber";
  return TypeInf.newTVar(KType).bind((type) =>
    TypeInf.pure([[{ isIn: typeClass, type }], { ...expr, type }])
  );
}

export function inferExpr(
  env: TypeEnv,
  expr: Expr
): TypeInf<[Predicate[], Expr<TypeInfo>]> {
  switch (expr.is) {
    // Literals
    case Expr.Is.Literal:
      return inferLit(expr);

    // Variable
    case Expr.Is.Variable:
      let scheme = env[expr.name.lexeme].type;
      return freshInst(scheme).bind(({ preds, type }) =>
        TypeInf.pure([preds, { ...expr, type }])
      );

    // Grouping
    case Expr.Is.Grouping:
      return inferExpr(env, expr.expression);

    // Function application
    case Expr.Is.Application:
      return inferApp(env, expr);

    // Special cases of function application
    case Expr.Is.Binary:
      return inferApp(env, {
        is: Expr.Is.Application,
        left: {
          is: Expr.Is.Application,
          left: expr.operator,
          right: expr.left,
        },
        right: expr.right,
      });

    default:
      throw new Error("Incomplete");
  }
}

export function inferApp(
  env: TypeEnv,
  expr: Expr & { is: Expr.Is.Application }
) {
  let { left, right } = expr;
  return inferExpr(env, left).bind(([ps, typedL]) =>
    inferExpr(env, right).bind(([qs, typedR]) =>
      TypeInf.newTVar({ is: Kind.Is.Type }).bind((typeResult) => {
        let lType = getType(typedL);
        let rType = getType(typedR);

        if (!lType || !rType) {
          throw new Error("Type error!");
        }

        return unify(lType, TFunc(rType, typeResult)).then(
          TypeInf.pure<[Predicate[], Expr<TypeInfo>]>([
            ps.concat(qs),
            { ...expr, left: typedL, right: typedR, type: typeResult },
          ])
        );
      })
    )
  );
}
