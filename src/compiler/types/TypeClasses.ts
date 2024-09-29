import { Scanner } from "../scan/Scanner";
import { ErrorReporter } from "../parse/Reporter";

import { TypeParser } from "../typecheck/TypeParser";
import { TypeVariable, MonoType, PolyType } from "../typecheck/Types";

type ClassInterface = { [name: string]: { type: PolyType; value?: any } };

export interface Class {
  name: string;
  superClass: string[];
  variable: TypeVariable;
  functions: ClassInterface;
}

export interface Instance {
  class: string;
  type: MonoType;
  functions: { [name: string]: any };
}

export function defineClass(
  name: string,
  superClass: string[], // TODO: Make this part of the name signature
  functions: { [name: string]: string | { type: string; value?: any } }
): Class {
  let tokens = new Scanner(name).scanTokens();
  let classType = new TypeParser(tokens, new ErrorReporter()).parse();

  if (classType.type !== "ty-app")
    throw new Error("Class must be defined as a type constructor");

  let {
    C: className,
    mus: [classTypeVariable],
  } = classType;

  if (!classTypeVariable || classTypeVariable.type !== "ty-var")
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
): Instance {
  let tokens = new Scanner(name).scanTokens();
  let instanceType = new TypeParser(tokens, new ErrorReporter()).parse();

  if (instanceType.type !== "ty-app")
    throw new Error("Instance must be defined as a type constructor");

  if (instanceType.mus.length !== 1)
    throw new Error("Instance must have once type parameter");

  return {
    class: instanceType.C,
    type: instanceType.mus[0],
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
