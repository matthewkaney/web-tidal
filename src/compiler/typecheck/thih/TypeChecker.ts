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

function nub(l: unknown[]) {
  if (l.length === 0) return [];

  let [head, ...rest] = l;

  rest = rest.filter((v) => !eq(v, head));

  return [head, ...nub(rest)];
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
  function kind(t: Type): Kind {
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
    }
  },
};
