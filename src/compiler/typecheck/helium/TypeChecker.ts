// Implementation of constraint-solving type inference based on
// Generalizing Hindley-Milner Type Inference Algorithms
// by Heeren & Hage (2002)

type Constraint = Constraint.Eq; //| Constraint.Dict;

import { Expr } from "../../parse/Expr";
import { TypeChecker as TC } from "../Types";

export namespace Constraint {
  export enum Type {
    Eq = "Equality",
    // Dict = "Dictionary",
  }

  interface Common {}

  export interface Eq extends Common {
    type: Type.Eq;
    lhs: TC.MonoType;
    rhs: TC.MonoType;
  }

  // export interface Dict extends Common {
  //   type: Type.Dict;
  // }
}

type Assumption = [string, TC.TypeVariable];

type Substitution = { [tyvar: string]: TC.MonoType };

// Fresh type variables

let varCounter = 0;

function freshTyVar(): TC.TypeVariable {
  return {
    type: TC.Type.TyVar,
    a: `t${varCounter++}`,
  };
}

// Bottom-up typing judgement

interface BUJudgement {
  sub: Substitution;
  assump: Assumption[];
  expr: Expr;
  type: TC.PolyType;
}

function BottomUp({ sub, assump, expr, type }: BUJudgement): BUJudgement {
  switch (expr.type) {
    // LIT
    case Expr.Type.Literal:
      let type: TC.TypeConstructor;

      switch (typeof expr.value) {
        case "string":
          type = {
            type: TC.Type.TyCon,
            C: "String",
            mus: [],
          };
      }

      return {
        sub: {},
        assump: [],
        expr,
        type: {
          type: TC.Type.TyQual,
          preds: [],
          head: type,
        },
      };

    case Expr.Type.Variable:
  }
}
