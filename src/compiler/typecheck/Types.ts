// Types

import { Expr } from "../parse/Expr";
import { Token } from "../scan/Token";

// mu ::= a
//      | C mu_0 ... mu_n

// sigma ::= mu
//         | Va. sigma

export type MonoType =
  | TypeChecker.TypeVariable
  | TypeChecker.FunctionType
  | TypeChecker.TypeConstructor;

export type PolyType = MonoType | TypeChecker.TypeQuantifier;

export namespace TypeChecker {
  export enum Type {
    TyVar = "Type Variable",
    TyCon = "Type Constructor",
    FnType = "Function Type",
    TyQuant = "Type Quantifier",
  }

  export interface Qualified<T> {
    preds: Predicate[];
    head: T;
  }

  export interface Predicate {
    isIn: string;
    type: MonoType;
  }

  export interface Instance {
    predicate: Qualified<Predicate>;
    functions: { [name: string]: any };
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

  export interface TypeQuantifier extends TypeCommon {
    type: Type.TyQuant;
    a: string;
    sigma: PolyType;
  }
}

// Contexts

export const ContextMarker = Symbol();
export type Context = {
  [ContextMarker]: boolean;
  [variable: string]: PolyType;
};

export const makeContext = (raw: {
  [ContextMarker]?: boolean;
  [variable: string]: PolyType;
}): Context => {
  raw[ContextMarker] = true;
  return raw as Context;
};

export const isContext = (something: unknown): something is Context => {
  return (
    typeof something === "object" &&
    something !== null &&
    ContextMarker in something
  );
};
