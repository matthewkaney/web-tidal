import { TypeChecker as TC } from "./Types";

import { makeSubstitution, contains } from "./Utilities";

// Most general unifier from THIH
export function mgu(type1: TC.MonoType, type2: TC.MonoType) {
  // Use varBind for cases of type variables
  if (type1.type === TC.Type.TyVar) {
    return varBind(type1, type2);
  }

  if (type2.type === TC.Type.TyVar) {
    return varBind(type2, type1);
  }

  // Special case function types
  if (type1.type === TC.Type.FnType || type2.type === TC.Type.FnType) {
    if (type1.type !== TC.Type.FnType || type2.type !== TC.Type.FnType) {
      throw new Error("Type Error: Both types must be functions");
    }

    let sIn = mgu(type1.in, type2.in);
    let sOut = mgu(sIn(type1.out), sIn(type1.out));

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
    let unified = mgu(s(type1.mus[i]), s(type2.mus[i]));

    s = s(unified);
  }

  return s;
}

function varBind(tyVar: TC.TypeVariable, type: TC.MonoType) {
  // Equivalent type variables just need the null substitution
  if (type.type === TC.Type.TyVar && tyVar.a === type.a) {
    return makeSubstitution({});
  }

  if (contains(type, tyVar)) {
    throw new Error("Infinite type detected");
  }

  // TODO: Check that substitution preserves kind

  return makeSubstitution({
    [tyVar.a]: type,
  });
}
