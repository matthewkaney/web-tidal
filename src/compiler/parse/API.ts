import { TokenType } from "../scan/TokenType";

// Tuple of precedence and associativity
export type Precedence = [number, "left" | "right"];
export type Operators = Map<string, Precedence>;

export type IDBinding = { type: string; value: any; synonyms?: string[] };
export type OperatorBinding = {
  type: string;
  value: any;
  synonyms?: string[];
  prec: Precedence;
};

export type Bindings = {
  [name: string]: IDBinding | OperatorBinding;
};

export function expandSynonyms(bindings: Bindings) {
  let expansions: Bindings = {};

  for (let { synonyms, ...binding } of Object.values(bindings)) {
    synonyms?.forEach((synonym) => {
      expansions[synonym] = { ...binding };
    });
  }

  return { ...bindings, ...expansions };
}

export function getOperators(bindings: Bindings) {
  let operators: Operators = new Map();

  for (let [id, value] of Object.entries(bindings)) {
    if ("prec" in value) {
      let { prec } = value;

      operators.set(id, prec);
    }
  }

  return operators;
}
