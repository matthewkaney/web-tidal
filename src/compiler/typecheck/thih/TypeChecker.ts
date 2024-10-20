// 2 Preliminaries

// Necessary Prelude functions and imports:

// List (nub, (\\), intersect, union, partition)
// Monad (msum)

function eq(a: unknown, b: unknown) {
  if (a === b) return true;

  if (typeof a === "object") {
    if (typeof b !== "object") return false;
    if (a === null || b === null) return false;

    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return false;

      if (a.length !== b.length) return false;

      return a.every((v, i) => eq(v, b[i]));
    }

    const compEntry = ([keyA]: [string, any], [keyB]: [string, any]) =>
      keyA < keyB ? -1 : keyA > keyB ? 1 : 0;

    const as = Object.entries(a).sort(compEntry);
    const bs = Object.entries(a).sort(compEntry);

    return eq(as, bs);
  }

  // All non-objects should have been equal
  return false;
}

function nub<T>(l: T[]): T[] {
  if (l.length === 0) return [];

  let [head, ...rest] = l;

  rest = rest.filter((v) => !eq(v, head));

  return [head, ...nub(rest)];
}

function union<T>(l1: T[], l2: T[]): T[] {
  return l1.concat(l2.filter((v2) => l1.every((v1) => !eq(v1, v2))));
}

function intersect<T>(l1: T[], l2: T[]): T[] {
  return l1.filter((v1) => l2.some((v2) => eq(v1, v2)));
}

// Initial Types

type Id = string;

function enumId(n: number) {
  return `v${n}`;
}

// 3 Kinds

type Kind = { kind: "star" } | { kind: "kfun"; args: [Kind, Kind] };

// 4 Types

type Type = TVar | TCon | TAp | TGen;

namespace Type {
  export function kind(t: Type): Kind {
    switch (t.type) {
      case "tvar":
      case "tycon":
        return t.kind;
      case "tyapp":
        return { kind: "star" };
    }
  }
}

interface TVar {
  type: "tvar";
  id: Id;
  kind: Kind;
}

interface TCon {
  type: "tycon";
  id: Id;
  kind: Kind;
}

interface TAp {
  type: "tyapp";
  args: [Type, Type];
}

interface TGen {
  type: "tgen";
  num: number;
}

// 5 Substitutions

type Subst = [TVar, Type][];

function lookup(s: Subst, id: Id) {
  return s.find(([tv]) => id === tv.id);
}

interface Types<T> {
  apply: (s: Subst, t: T) => T;
  tv: (t: T) => TVar[];
}

const TypesType: Types<Type> = {
  apply: (s, t) => {
    switch (t.type) {
      case "tvar":
        const sub = lookup(s, t.id);
        return sub ? sub[1] : t;
      case "tyapp":
        const [l, r] = t.args;
        return {
          type: "tyapp",
          args: [TypesType.apply(s, l), TypesType.apply(s, r)],
        };
      default:
        return t;
    }
  },

  tv: (t) => {
    switch (t.type) {
      case "tvar":
        return [t];
      case "tyapp":
        let [l, r] = t.args;
        return union(TypesType.tv(l), TypesType.tv(r));
      default:
        return [];
    }
  },
};

namespace Subst {
  export function compose(s1: Subst, s2: Subst): Subst {
    return s2
      .map<[TVar, Type]>(([u, t]) => [u, TypesType.apply(s1, t)])
      .concat(s1);
  }

  export function merge(s1: Subst, s2: Subst): Subst {
    const fst = ([v]: [TVar, Type]) => v;

    const agree = intersect(s1.map(fst), s2.map(fst)).every(
      (v) => TypesType.apply(s1, v) === TypesType.apply(s2, v)
    );

    if (agree) {
      return s1.concat(s2);
    } else {
      throw new Error("Merge fails");
    }
  }
}

// 6 Unification and Matching

export function mgu(type1: Type, type2: Type): Subst {
  if (type1.type === "tyapp" && type2.type === "tyapp") {
    let [l1, r1] = type1.args;
    let [l2, r2] = type2.args;

    let s1 = mgu(l1, l2);
    let s2 = mgu(TypesType.apply(s1, r1), TypesType.apply(s1, r2));
    return Subst.compose(s1, s2);
  }

  // Use varBind for cases of type variables
  if (type1.type === "tvar") {
    return varBind(type1, type2);
  }

  if (type2.type === "tvar") {
    return varBind(type2, type1);
  }

  if (type1.type === "tycon" && type2.type === "tycon") {
    if (type1.id === type2.id) {
      return [];
    }
  }

  throw new Error("types do not unify");
}

function varBind(tyVar: TVar, type: Type): Subst {
  // Equivalent type variables just need the null substitution
  if (eq(tyVar, type)) {
    return [];
  }

  if (TypesType.tv(type).some((t) => eq(t, tyVar))) {
    throw new Error("occurs check fails");
  }

  if (eq(Type.kind(tyVar), Type.kind(type))) {
    throw new Error("kinds do not match");
  }

  return [[tyVar, type]];
}

function match(type1: Type, type2: Type): Subst {
  if (type1.type === "tyapp" && type2.type === "tyapp") {
    let [l1, r1] = type1.args;
    let [l2, r2] = type2.args;

    let s1 = match(l1, l2);
    let s2 = match(TypesType.apply(s1, r1), TypesType.apply(s1, r2));
    return Subst.merge(s1, s2);
  }

  // Use varBind for cases of type variables
  if (type1.type === "tvar") {
    if (eq(Type.kind(type1), Type.kind(type2))) {
      return [[type1, type2]];
    }
  }

  if (type1.type === "tycon" && type2.type === "tycon") {
    if (type1.id === type2.id) {
      return [];
    }
  }

  throw new Error("types do not match");
}

// 7 Type Classes, Predicates and Qualified Types
// 7.1 Basic Definitions

export interface Qualified<T> {
  preds: Predicate[];
  head: T;
}

export interface Predicate {
  isIn: Id;
  type: Type;
}

function TypesQual<T, U extends Types<T>>(dict: U): Types<Qualified<T>> {
  return {
    apply: (s, { preds, head }) => ({
      preds: preds.map((p) => TypesPred.apply(s, p)),
      head: dict.apply(s, head),
    }),
    tv: ({ preds, head }) =>
      union(nub(preds.flatMap((p) => TypesPred.tv(p))), dict.tv(head)),
  };
}

const TypesPred: Types<Predicate> = {
  apply: (s, { isIn, type }) => ({
    isIn,
    type: TypesType.apply(s, type),
  }),

  tv: ({ type }) => TypesType.tv(type),
};

export function mguPred(p1: Predicate, p2: Predicate) {
  if (p1.isIn !== p2.isIn) {
    throw new Error("Classes differ");
  }

  return mgu(p1.type, p2.type);
}

export function matchPred(p1: Predicate, p2: Predicate) {
  if (p1.isIn !== p2.isIn) {
    throw new Error("Classes differ");
  }

  return match(p1.type, p2.type);
}

type Class = [Id[], Inst[]];

type Inst = Qualified<Predicate>;

// 7.2 Class Environments

interface ClassEnv {
  classes: { [id: Id]: Class };
  defaults: Type[];
}

const getSuper = (ce: ClassEnv, id: Id) => ce.classes[id][0];

const getInsts = (ce: ClassEnv, id: Id) => ce.classes[id][1];

// Do we need `defined` function?

const modify = ({ classes, defaults }: ClassEnv, id: Id, c: Class) => ({
  classes: { ...classes, [id]: c },
  defaults,
});

function addClass(id: Id, supers: Id[], ce: ClassEnv) {
  if (id in ce.classes) {
    throw new Error("class already defined");
  }

  if (supers.some((sId) => !(sId in ce.classes))) {
    throw new Error("superclass not defined");
  }

  return modify(ce, id, [supers, []]);
}

// Add prelude classes
// Add Core classes
// Add Num classes

function addInst(ps: Predicate[], p: Predicate, ce: ClassEnv) {
  let className = p.isIn;

  if (!(className in ce.classes)) {
    throw new Error("no class for instance");
  }

  let its = getInsts(ce, className);

  if (its.map((i) => i.head).some((q) => overlap(p, q))) {
    throw new Error(`overlapping instance`);
  }

  return modify(ce, className, [
    getSuper(ce, className),
    [{ preds: ps, head: p }, ...its],
  ]);
}

function overlap(p: Predicate, q: Predicate) {
  try {
    mguPred(p, q);
    return true;
  } catch (e) {
    return false;
  }
}

// Example Instances

// 7.3 Entailment

function bySuper(ce: ClassEnv, p: Predicate): Predicate[] {
  let { isIn: i, type: t } = p;
  return [
    p,
    ...getSuper(ce, i).flatMap((i1) => bySuper(ce, { isIn: i1, type: t })),
  ];
}

function byInst(ce: ClassEnv, p: Predicate) {
  let { isIn: i, type: t } = p;

  const tryInst = ({ preds: ps, head: h }: Inst) => {
    let u = matchPred(h, p);
    return ps.map((p1) => TypesPred.apply(u, p1));
  };

  //
  for (let it of getInsts(ce, i)) {
    try {
      return tryInst(it);
    } catch (e) {}
  }

  throw new Error("byInst failed");
}

function entail(ce: ClassEnv, ps: Predicate[], p: Predicate): boolean {
  let checkSupers = ps
    .map((p1) => bySuper(ce, p1))
    .some((ps1) => ps1.some((p2) => eq(p, p2)));

  let checkInst: boolean;

  try {
    checkInst = byInst(ce, p).every((q) => entail(ce, ps, q));
  } catch (e) {
    checkInst = false;
  }

  return checkSupers || checkInst;
}

// 7.4 Context Reduction
