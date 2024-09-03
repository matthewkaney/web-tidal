import { Expr } from "../Expr";
import { Stmt } from "../Stmt";
import { Environment } from "../Environment";
import { ErrorReporter } from "../Reporter";

import { Scanner } from "../Scanner";
import { TypeParser } from "./TypeParser";

import { makeContext, PolyType } from "./Types";
import { ParseError } from "../BaseParser";
import { W } from "./Inference";

export class TypeChecker {
  private environment: { [name: string]: PolyType } = {};

  constructor(
    private readonly reporter: ErrorReporter,
    bindings: { [name: string]: string }
  ) {
    for (let [name, typeString] of Object.entries(bindings)) {
      let tokens = new Scanner(typeString).scanTokens();

      try {
        let type = new TypeParser(tokens, reporter).parse();

        this.environment[name] = type;
      } catch (e) {
        if (e instanceof Error) {
          console.log("Error parsing type definition:");
          console.log(typeString);
          console.log(e.message);
        } else {
          throw e;
        }
      }
    }
  }

  check(statements: Stmt[]) {
    for (let statement of statements) {
      switch (statement.type) {
        case Stmt.Type.Expression:
          return W(makeContext(this.environment), statement.expression);
        default:
          return statement.type satisfies never;
      }
    }
  }

  // private checkExpression(expression: Expr): Type {
  //   switch (expression.type) {
  //     case Expr.Type.Assignment:
  //       throw Error("Assignment not implemented");
  //     case Expr.Type.Application:
  //       let funcType = this.checkExpression(expression.left);
  //       let argType = this.checkExpression(expression.right);
  //       if (funcType.type !== "Function") {
  //         throw new Error(`Expected function, got ${funcType.type}`);
  //       }
  //       if (!isEqualType(funcType.arg, argType)) {
  //         throw new Error(
  //           `Argument type mismatch: expected ${JSON.stringify(
  //             funcType.arg
  //           )}, got ${JSON.stringify(argType)}`
  //         );
  //       }
  //       return funcType.return;
  //     case Expr.Type.Binary:
  //       let leftType = this.checkExpression(expression.left);
  //       let operatorType = this.environment.get(expression.operator);
  //       let rightType = this.checkExpression(expression.right);

  //       if (
  //         operatorType.type !== "Function" ||
  //         operatorType.return.type !== "Function"
  //       ) {
  //         throw Error(
  //           `Operator "${expression.operator.lexeme}" has an incorrect type definition.`
  //         );
  //       }

  //       if (!isEqualType(operatorType.arg, leftType)) {
  //         throw Error(
  //           `Type mismatch on left side of operator "${
  //             expression.operator.lexeme
  //           }": expected ${JSON.stringify(
  //             operatorType.arg
  //           )} and got ${JSON.stringify(leftType)} instead.`
  //         );
  //       }

  //       if (!isEqualType(operatorType.return.arg, rightType)) {
  //         throw Error(
  //           `Type mismatch on right side of operator "${
  //             expression.operator.lexeme
  //           }": expected ${JSON.stringify(
  //             operatorType.return.arg
  //           )} and got ${JSON.stringify(rightType)} instead.`
  //         );
  //       }

  //       return operatorType.return.return;
  //     case Expr.Type.Section:
  //       throw Error("Section not implemented");
  //     case Expr.Type.Unary:
  //       throw Error("Unary not implemented");
  //     case Expr.Type.Grouping:
  //       return this.checkExpression(expression.expression);
  //     case Expr.Type.List:
  //       throw Error("List not implemented");
  //     case Expr.Type.Literal:
  //       switch (typeof expression.value) {
  //         case "string":
  //           return { type: "TypeCon", name: "String", params: [] };
  //         case "number":
  //           return { type: "TypeCon", name: "Number", params: [] };
  //         case "boolean":
  //           return { type: "TypeCon", name: "Boolean", params: [] };
  //       }
  //     case Expr.Type.Variable:
  //       return this.environment.get(expression.name);
  //     default:
  //       return expression satisfies never;
  //   }
  // }
}

// function isEqualType(t1: Type, t2: Type) {
//   if (t1.type !== t2.type) {
//     return false;
//   }

//   if (t1.type === "Function" && t2.type === "Function") {
//     return isEqualType(t1.arg, t2.arg) && isEqualType(t1.return, t2.return);
//   }

//   if (t1.type === "TypeCon" && t2.type === "TypeCon") {
//     if (t1.name !== t2.name) return false;

//     if (t1.params.length !== t2.params.length) return false;

//     return t1.params.every((v1, index) => isEqualType(v1, t2.params[index]));
//   }

//   return true;
// }
