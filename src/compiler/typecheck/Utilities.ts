import { printType } from "./Printer";
import { TypeChecker as TC, Context, Type } from "./Types";

// substitutions

export type Substitution = {
  type: "substitution";
  (m: TC.MonoType): TC.MonoType;
  (t: TC.PolyType): TC.PolyType;
  (c: Context): Context;
  (s: Substitution): Substitution;
  raw: { [typeVariables: string]: TC.MonoType };
};

export const makeSubstitution = (raw: Substitution["raw"]): Substitution => {
  const fn = ((arg: TC.MonoType | TC.PolyType | Context | Substitution) => {
    if (arg.type === "substitution") return combine(fn, arg);
    return apply(fn, arg);
  }) as Substitution;
  fn.type = "substitution";
  fn.raw = raw;
  return fn;
};

function apply<T extends TC.MonoType | TC.PolyType | Context>(
  substitution: Substitution,
  value: T
): T;
function apply(
  s: Substitution,
  value: TC.MonoType | TC.PolyType | Context
): TC.MonoType | TC.PolyType | Context {
  if (Context.is(value)) {
    return Context.apply(s, value);
  }

  return Type.apply(s, value);
}

const combine = (s1: Substitution, s2: Substitution): Substitution => {
  return makeSubstitution({
    ...s1.raw,
    ...Object.fromEntries(Object.entries(s2.raw).map(([k, v]) => [k, s1(v)])),
  });
};

// new type variable
let currentTypeVar = 0;
export const newTypeVar = (): TC.TypeVariable => ({
  type: TC.Type.TyVar,
  a: `t${currentTypeVar++}`,
});

// instantiate
// mappings = { a |-> t0, b |-> t1 }
// Va. Vb. a -> b
// t0 -> t1
export const instantiate = (
  type: TC.PolyType,
  mappings: Map<string, TC.TypeVariable> = new Map()
): TC.MonoType => {
  if (type.type === TC.Type.TyVar) {
    return mappings.get(type.a) ?? type;
  }

  if (type.type === TC.Type.TyCon) {
    return { ...type, mus: type.mus.map((m) => instantiate(m, mappings)) };
  }

  if (type.type === TC.Type.FnType) {
    return {
      ...type,
      in: instantiate(type.in, mappings),
      out: instantiate(type.out, mappings),
    };
  }

  if (type.type === TC.Type.TyQuant) {
    mappings.set(type.a, newTypeVar());
    return instantiate(type.sigma, mappings);
  }

  throw new Error("Unknown type passed to instantiate");
};

// generalise
export const generalise = (ctx: Context, type: TC.MonoType): TC.PolyType => {
  const quantifiers = diff(freeVars(type), freeVars(ctx));
  let t: TC.PolyType = type;
  quantifiers.forEach((q) => {
    t = { type: TC.Type.TyQuant, a: q, sigma: t };
  });
  return t;
};

const diff = <T>(a: T[], b: T[]): T[] => {
  const bset = new Set(b);
  return a.filter((v) => !bset.has(v));
};

const freeVars = (value: TC.PolyType | Context): string[] => {
  if (isContext(value)) {
    return Object.values(value).flatMap(freeVars);
  }

  if (value.type === TC.Type.TyVar) {
    return [value.a];
  }

  if (value.type === TC.Type.TyCon) {
    return value.mus.flatMap(freeVars);
  }

  if (value.type === TC.Type.FnType) {
    return freeVars(value.in).concat(freeVars(value.out));
  }

  if (value.type === TC.Type.TyQuant) {
    return freeVars(value.sigma).filter((v) => v !== value.a);
  }

  throw new Error("Unknown argument passed to substitution");
};

// unify

export class UnificationError extends Error {
  constructor(
    public type1: TC.PolyType,
    public type2: TC.PolyType,
    message?: string
  ) {
    super();

    // Set unification error message
    this.message =
      message ??
      `Types don't match: expected ${this.type1String}, got ${this.type2String}`;
  }

  get type1String() {
    return printType(this.type1);
  }

  get type2String() {
    return printType(this.type2);
  }
}

export function unify(type1: TC.MonoType, type2: TC.MonoType): Substitution {
  if (
    type1.type === TC.Type.TyVar &&
    type2.type === TC.Type.TyVar &&
    type1.a === type2.a
  ) {
    return makeSubstitution({});
  }

  if (type1.type === TC.Type.TyVar) {
    if (contains(type2, type1)) throw new Error("Infinite type detected");

    return makeSubstitution({
      [type1.a]: type2,
    });
  }

  if (type2.type === TC.Type.TyVar) {
    return unify(type2, type1);
  }

  if (type1.type === TC.Type.FnType || type2.type === TC.Type.FnType) {
    if (type1.type !== TC.Type.FnType || type2.type !== TC.Type.FnType) {
      throw new Error("Type Error: Both types must be functions");
    }

    let sIn = unify(type1.in, type2.in);
    let sOut = unify(sIn(type1.out), sIn(type1.out));

    return sOut(sIn);
  }

  if (type1.C !== type2.C) {
    throw new Error("Type Error: Mismatched type constructors");
  }

  if (type1.mus.length !== type2.mus.length) {
    throw new Error(
      "Type Error: Mismatched number of arguments to type constructor"
    );
  }

  let s = makeSubstitution({});
  for (let i = 0; i < type1.mus.length; i++) {
    let unified = unify(s(type1.mus[i]), s(type2.mus[i]));

    s = s(unified);
  }

  return s;
}

export const contains = (
  value: TC.MonoType,
  type2: TC.TypeVariable
): boolean => {
  if (value.type === TC.Type.TyVar) {
    return value.a === type2.a;
  }

  if (value.type === TC.Type.FnType) {
    return contains(value.in, type2) || contains(value.out, type2);
  }

  if (value.type === TC.Type.TyCon) {
    return value.mus.some((t) => contains(t, type2));
  }

  throw new Error("Unknown argument passed to substitution");
};
