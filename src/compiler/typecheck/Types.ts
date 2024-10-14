// Types

import { Expr } from "../parse/Expr";
import { Token } from "../scan/Token";
import { mgu as typeMGU } from "./Unification";
import { Substitution, makeSubstitution } from "./Utilities";

// mu ::= a
//      | C mu_0 ... mu_n

// sigma ::= mu
//         | Va. sigma

export namespace TypeChecker {
  export enum Type {
    TyVar = "Type Variable",
    TyCon = "Type Constructor",
    FnType = "Function Type",
    TyQual = "Qualified Type",
    TyQuant = "Type Quantifier",
  }

  export type MonoType =
    | TypeChecker.TypeVariable
    | TypeChecker.FunctionType
    | TypeChecker.TypeConstructor;

  export type PolyType = TypeChecker.QualifiedType | TypeChecker.TypeQuantifier;

  export interface Instance {
    predicate: Qualified<Predicate>;
    functions: { [name: string]: any };
  }

  export function overlap(pred1: Predicate, pred2: Predicate) {
    try {
      // In this implementation, the unification function will return an error if
      // no unifying substitution exists.
      Predicate.mgu(pred1, pred2);
      return true;
    } catch (e) {
      return false;
    }
  }

  export interface TypeCommon {}

  export interface TypeVariable extends TypeCommon {
    type: Type.TyVar;
    a: string;
  }

  export interface TypeConstructor extends TypeCommon {
    type: Type.TyCon;
    C: string;
    mus: MonoType[];
  }

  export interface FunctionType extends TypeCommon {
    type: Type.FnType;
    in: MonoType;
    out: MonoType;
  }

  export interface QualifiedType extends TypeCommon, Qualified<MonoType> {
    type: Type.TyQual;
  }

  export interface TypeQuantifier extends TypeCommon {
    type: Type.TyQuant;
    a: string;
    sigma: PolyType;
  }
}

export interface Qualified<T> {
  preds: Predicate[];
  head: T;
}

export namespace Qualified {
  export function apply<T extends Predicate | TypeChecker.MonoType>(
    s: Substitution,
    qual: Qualified<T>
  ): Qualified<T>;
  export function apply(
    s: Substitution,
    { preds, head }: Qualified<Predicate> | TypeChecker.QualifiedType
  ): Qualified<Predicate> | TypeChecker.QualifiedType {
    // Apply to predicates
    preds = preds.map((p) => Predicate.apply(s, p));

    if ("isIn" in head) {
      return { preds, head: Predicate.apply(s, head) };
    } else {
      return {
        type: TypeChecker.Type.TyQual,
        preds,
        head: Type.apply(s, head),
      };
    }
  }
}

export interface Predicate {
  isIn: string;
  type: TypeChecker.MonoType;
}

export namespace Predicate {
  export function apply(s: Substitution, { isIn, type }: Predicate): Predicate {
    return {
      isIn,
      type: Type.apply(s, type),
    };
  }

  export function mgu(p1: Predicate, p2: Predicate) {
    if (p1.isIn !== p2.isIn) {
      throw new Error("Classes differ");
    }

    return typeMGU(p1.type, p2.type);
  }
}

export namespace Type {
  export function apply<T extends TypeChecker.MonoType | TypeChecker.PolyType>(
    s: Substitution,
    value: T
  ): T;
  export function apply(
    s: Substitution,
    value: TypeChecker.MonoType | TypeChecker.PolyType
  ) {
    switch (value.type) {
      case TypeChecker.Type.TyVar:
        return s.raw[value.a] ?? value;
      case TypeChecker.Type.TyCon:
        return { ...value, mus: value.mus.map((m) => apply(s, m)) };
      case TypeChecker.Type.FnType:
        return { ...value, in: apply(s, value.in), out: apply(s, value.out) };
      case TypeChecker.Type.TyQual:
        return Qualified.apply(s, value);
      case TypeChecker.Type.TyQuant: {
        if (value.type === TypeChecker.Type.TyQuant) {
          const substitutionWithoutQuantifier = makeSubstitution(
            Object.fromEntries(
              Object.entries(s.raw).filter(([k, v]) => k !== value.a)
            )
          );
          return {
            ...value,
            sigma: apply(substitutionWithoutQuantifier, value.sigma),
          };
        }
      }
      default:
        return value satisfies never;
    }
  }
}

// Contexts

export interface Context {
  [Context.isContext]: true;
  [variable: string]: TypeChecker.PolyType;
}

export namespace Context {
  export const isContext = Symbol();

  export function is(value: unknown): value is Context {
    return typeof value === "object" && value !== null && value[isContext];
  }

  export function asContext(
    raw: Context | Omit<Context, typeof isContext>
  ): Context {
    return {
      [isContext]: true,
      ...raw,
    };
  }

  export function apply(s: Substitution, value: Context) {
    return asContext(
      Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, Type.apply(s, v)])
      )
    );
  }
}
