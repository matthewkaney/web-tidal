import { ErrorReporter } from "./parse/Reporter";
import { Primitive, Token } from "./scan/Token";
import { Expr } from "./parse/Expr";
import { Stmt } from "./parse/Stmt";
import { Bindings } from "./parse/API";

import { Pattern } from "../strudel";

type Value = Primitive | Value[] | ((input: Value) => Value);

export class Interpreter {
  constructor(
    private readonly reporter: ErrorReporter,
    private bindings: Bindings
  ) {}

  interpret(statements: Stmt[]) {
    let results: string[] = [];

    try {
      for (let statement of statements) {
        let result = this.execute(statement);

        if (
          typeof result === "object" &&
          result !== null &&
          "runIO" in result &&
          typeof result.runIO === "function"
        ) {
          result.runIO();
        } else if (result !== undefined) {
          results.push(this.stringify(result));
        }
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        this.reporter.error(error.token.from, error.token.to, error.message);
      } else {
        throw error;
      }
    }

    return results;
  }

  private stringify(object: Primitive) {
    // @ts-ignore
    if (object instanceof Pattern) {
      return (object as Pattern)
        .firstCycle()
        .map((hap) => hap.show(true))
        .join(", ");
    }

    if (object == null) return "null";

    return object.toString();
  }

  private execute(stmt: Stmt) {
    switch (stmt.type) {
      case Stmt.Type.Expression:
        return this.evaluate(stmt.expression) as any;
      // case Stmt.Type.Print:
      //   //const value = this.evaluate(stmt.expression);
      //   //return [this.stringify(value)];
      //   return;
      // case Stmt.Type.Var: {
      //   // let value: LoxType = null;
      //   // if (stmt.initializer != null) {
      //   //   value = this.evaluate(stmt.initializer);
      //   // }

      //   // this.environment.define(stmt.name.lexeme, value);
      //   return;
      // }
    }
  }

  private evaluate(expr: Expr): Value | null {
    switch (expr.type) {
      case Expr.Type.Literal:
        return expr.value;
      case Expr.Type.List:
        return expr.items.map((e) => this.evaluate(e));
      case Expr.Type.Grouping:
        return this.evaluate(expr.expression);
      case Expr.Type.Binary: {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        if (expr.operator.lexeme in this.bindings) {
          return this.bindings[expr.operator.lexeme].value(left, right);
        }

        throw new RuntimeError(expr.operator, "Operator isn't implemented");
      }
      case Expr.Type.Section: {
        return (input: Value) => {
          const opFunc = this.bindings[expr.operator.lexeme].value;
          const operand = this.evaluate(expr.expression);

          return expr.side === "left"
            ? opFunc(input, operand)
            : opFunc(operand, input);
        };
      }
      case Expr.Type.Variable:
        if (expr.name.lexeme in this.bindings) {
          return this.bindings[expr.name.lexeme].value;
        } else {
          throw new RuntimeError(
            expr.name,
            `Variable "${expr.name.lexeme}" is undefined`
          );
        }
      case Expr.Type.Application: {
        const left = this.curry(expr.left);
        const right = this.evaluate(expr.right);
        return left(right);
      }
    }
  }

  private curry(func: Expr): Function {
    if (func.type === Expr.Type.Variable || func.type === Expr.Type.Section) {
      return this.evaluate(func) as any;
    } else if (func.type === Expr.Type.Grouping) {
      return this.curry(func.expression);
    } else if (func.type === Expr.Type.Application) {
      const arg = this.evaluate(func.right);
      return (...args: any[]) => this.curry(func.left)(arg, ...args);
    }

    throw new Error("Unexpected function");
  }
}

export class RuntimeError extends Error {
  constructor(readonly token: Token, message: string) {
    super(message);
  }
}
