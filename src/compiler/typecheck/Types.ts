// Types

import { Expr } from "../parse/Expr";
import { Token } from "../scan/Token";

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

  export interface Qualified<T> {
    preds: Predicate[];
    head: T;
  }

  export type MonoType =
    | TypeChecker.TypeVariable
    | TypeChecker.FunctionType
    | TypeChecker.TypeConstructor;

  export type PolyType = TypeChecker.QualifiedType | TypeChecker.TypeQuantifier;

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

  export interface QualifiedType extends TypeCommon, Qualified<MonoType> {
    type: Type.TyQual;
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
  [variable: string]: TypeChecker.PolyType;
};

export const makeContext = (raw: {
  [ContextMarker]?: boolean;
  [variable: string]: TypeChecker.PolyType;
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
