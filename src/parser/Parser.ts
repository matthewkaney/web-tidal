import { BaseParser } from "./BaseParser";

import { TokenType } from "./TokenType";

import { Expr } from "./Expr";
import { Stmt } from "./Stmt";

export class Parser extends BaseParser<Stmt[]> {
  parse() {
    const statements: Stmt[] = [];

    while (!this.isAtEnd()) {
      statements.push(this.expressionStatement());
    }

    return statements;
  }

  private expressionStatement() {
    const expression = this.expression();

    if (!this.isAtEnd()) {
      this.consume(TokenType.LineBreak, "Expect new line after expression.");
    }

    return Stmt.Expression(expression);
  }

  private expression() {
    return this.dollarApplication();
  }

  private dollarApplication() {
    const expr = this.join();

    if (this.match(TokenType.Dollar)) {
      const right = this.dollarApplication();
      return Expr.Application(expr, right);
    }

    return expr;
  }

  private join() {
    let expr = this.term();

    while (
      this.match(
        TokenType.LeftSL,
        TokenType.LeftSB,
        TokenType.LeftSR,
        TokenType.RightSL,
        TokenType.RightSB,
        TokenType.RightSR
      )
    ) {
      const operator = this.previous();
      const right = this.term();
      expr = Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private term() {
    let expr = this.factor();

    while (
      this.match(
        TokenType.Plus,
        TokenType.PlusSL,
        TokenType.PlusSB,
        TokenType.PlusSR,
        TokenType.Minus,
        TokenType.MinusSL,
        TokenType.MinusSB,
        TokenType.MinusSR
      )
    ) {
      const operator = this.previous();
      const right = this.factor();
      expr = Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private factor() {
    let expr = this.application();

    while (
      this.match(
        TokenType.Star,
        TokenType.StarSL,
        TokenType.StarSB,
        TokenType.StarSR,
        TokenType.Slash,
        TokenType.SlashSL,
        TokenType.SlashSB,
        TokenType.SlashSR
      )
    ) {
      const operator = this.previous();
      const right = this.application();
      expr = Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private application() {
    let expr = this.functionTerm();

    while (this.peekFunctionTerm()) {
      let right = this.functionTerm();
      expr = Expr.Application(expr, right);
    }

    return expr;
  }

  private peekFunctionTerm() {
    const nextType = this.peek().type;

    return (
      nextType === TokenType.Identifier ||
      nextType === TokenType.LeftParen ||
      nextType === TokenType.Number ||
      nextType === TokenType.String
    );
  }

  private functionTerm() {
    if (this.match(TokenType.Number, TokenType.String)) {
      return Expr.Literal(this.previous().literal);
    }

    if (this.match(TokenType.Identifier)) {
      return Expr.Variable(this.previous());
    }

    if (this.match(TokenType.LeftParen)) {
      let expr = this.expression();
      this.consume(TokenType.RightParen, "Expect ')' after expression.");
      return Expr.Grouping(expr);
    }

    throw this.error(this.peek(), "Expect expression.");
  }
}
