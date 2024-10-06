import { Scanner } from "../scan/Scanner";
import { ErrorReporter } from "../parse/Reporter";

import { TypeParser } from "./TypeParser";
import { TypeChecker as TC, MonoType, PolyType } from "./Types";

type ClassInterface = { [name: string]: { type: PolyType; value?: any } };

export interface Class {
  name: string;
  superClass: string[];
  variable: TC.TypeVariable;
  functions: ClassInterface;
}

export function defineClass(
  name: string,
  superClass: string[], // TODO: Make this part of the name signature
  functions: { [name: string]: string | { type: string; value?: any } }
): Class {
  let tokens = new Scanner(name).scanTokens();
  let classType = new TypeParser(tokens, new ErrorReporter()).parseClass();

  if (classType.type !== TC.Type.TyCon)
    throw new Error(
      `Class must be defined as a type constructor: ${JSON.stringify(
        classType
      )}`
    );

  let {
    C: className,
    mus: [classTypeVariable],
  } = classType;

  if (!classTypeVariable || classTypeVariable.type !== TC.Type.TyVar)
    throw new Error("Class must have type variable");

  let classFunctions: ClassInterface = {};

  for (let [fName, fTypeInfo] of Object.entries(functions)) {
    let fTypeSig = typeof fTypeInfo === "string" ? fTypeInfo : fTypeInfo.type;
    let fTokens = new Scanner(fTypeSig).scanTokens();
    let fType = new TypeParser(fTokens, new ErrorReporter()).parse();

    classFunctions[fName] = {
      type: fType,
      value: typeof fTypeInfo === "object" ? fTypeInfo.value : undefined,
    };
  }

  return {
    name: className,
    superClass,
    variable: classTypeVariable,
    functions: classFunctions,
  };
}

export function defineInstance(
  name: string,
  functions: { [name: string]: any } = {}
): TC.Instance {
  let tokens = new Scanner(name).scanTokens();
  let { head, preds } = new TypeParser(
    tokens,
    new ErrorReporter()
  ).parseQualifiedType();

  if (head.type !== TC.Type.TyCon)
    throw new Error("Instance must be defined as a type constructor");

  if (head.mus.length !== 1)
    throw new Error("Instance must have once type parameter");

  return {
    predicate: {
      preds,
      head: {
        isIn: head.C,
        type: head.mus[0],
      },
    },
    functions,
  };
}

// A few example type class declarations for testing

// Eq
let Eq = defineClass("Eq a", [], {
  "==": "a -> a -> Bool",
  "/=": "a -> a -> Bool",
});

let basicEq = {
  "==": (a, b) => a === b,
  "/=": (a, b) => a !== b,
};

let EqNumber = defineInstance("Eq Number", basicEq);
let EqString = defineInstance("Eq String", basicEq);

let EqList = defineInstance("Eq a => Eq [a]", {
  "==": (as, bs) =>
    as.length === bs.length && as.every((a, index) => a === bs[index]),
  "/=": (as, bs) =>
    as.length !== bs.length || as.some((a, index) => a !== bs[index]),
});

console.log(EqList);

// Ord
let Ord = defineClass("Ord a", ["Eq"], {
  compare: "a -> a -> Ordering",
  "<": "a -> a -> Bool",
  "<=": "a -> a -> Bool",
  ">": "a -> a -> Bool",
  ">=": "a -> a -> Bool",
  max: "a -> a -> a",
  min: "a -> a -> a",
});

// Functor
// Currently the system doesn't entail checking the kind of f
// Is this strictly needed for a minimum viable implementation?
let Functor = defineClass("Functor f", [], {
  fmap: "(a -> b) -> f a -> f b",
  "<$": "a -> f a -> f b",
});
