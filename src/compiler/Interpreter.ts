import { ErrorReporter } from "./parse/Reporter";
import { Token, tokenBounds } from "./scan/Token";
import { Expr } from "./parse/AST/Expr";
import { Stmt } from "./parse/AST/Stmt";
import { Bindings } from "./parse/API";

import { Pattern } from "../strudel";
import { TokenType } from "./scan/TokenType";

type Value = Value[] | ((input: Value) => Value);

export class Interpreter {
  constructor(
    private readonly reporter: ErrorReporter,
    private bindings: Bindings
  ) {}

  interpret(statements: Stmt[]) {
    let results: any[] = [];

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
          results.push(result);
        }
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        let { from, to } = tokenBounds(error.token);
        this.reporter.error(from, to, error.message);
      } else {
        throw error;
      }
    }

    return results;
  }

  private stringify(object: any) {
    // @ts-ignore
    if (object instanceof Pattern) {
      return (object as Pattern)
        .firstCycle()
        .map((hap: any) => hap.show(true))
        .join(", ");
    }

    if (object == null) return "null";

    return object.toString();
  }

  private execute(stmt: Stmt) {
    switch (stmt.is) {
      case Stmt.Is.Expression:
        return this.evaluate(stmt.expression) as any;
    }
  }

  private evaluate(expr: Expr): any {
    switch (expr.is) {
      case Expr.Is.Literal:
        return this.evaluateLiteral(expr);
      case Expr.Is.List:
        return expr.items.map((e) => this.evaluate(e));
      case Expr.Is.Grouping:
        return this.evaluate(expr.expression);
      case Expr.Is.Binary: {
        const left = this.evaluate(expr.left);
        const opFunc = this.evaluate(expr.operator);
        const right = this.evaluate(expr.right);

        return opFunc(left, right);
      }
      case Expr.Is.Section: {
        return (input: Value) => {
          const opFunc = this.evaluate(expr.operator);
          const operand = this.evaluate(expr.expression);

          return expr.side === "left"
            ? opFunc(input, operand)
            : opFunc(operand, input);
        };
      }
      case Expr.Is.Variable:
        return this.bindings[expr.name.lexeme].value;
      case Expr.Is.Application: {
        const left = this.curry(expr.left);
        const right = this.evaluate(expr.right);
        return left(right);
      }
    }
  }

  private evaluateLiteral({ token }: Expr.Literal): string | number {
    switch (token.type) {
      case TokenType.Number:
        // Parse number
        return parseFloat(token.lexeme);
      case TokenType.String:
        // Trim surrounding quotes
        return token.lexeme.substring(1, token.lexeme.length - 1);
    }
  }

  private curry(func: Expr): Function {
    if (func.is === Expr.Is.Variable || func.is === Expr.Is.Section) {
      return this.evaluate(func) as any;
    } else if (func.is === Expr.Is.Grouping) {
      return this.curry(func.expression);
    } else if (func.is === Expr.Is.Application) {
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
