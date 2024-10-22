import { TokenType } from "../scan/TokenType";
import { BaseParser } from "../parse/BaseParser";

import { TypeChecker as TC, Context } from "./Types";
import { generalise } from "./Utilities";

export class TypeParser extends BaseParser<TC.PolyType> {
  parse() {
    // TODO: Check if we've reached the end
    return generalise(Context.asContext({}), this.functionType());
  }

  parseClass() {
    return this.typeConstructor();
  }

  parseQualifiedType() {
    // TODO: generalize
    return this.qualifiedType();
  }

  private qualifiedType(): TC.Qualified<TC.MonoType> {
    const context = this.functionType();

    if (this.match(TokenType.DoubleArrow)) {
      if (context.type !== TC.Type.TyCon)
        throw new Error("Type constraint must be a type constructor");

      return {
        preds: context.mus.map((type) => ({ isIn: context.C, type })),
        head: this.functionType(),
      };
    } else {
      return {
        preds: [],
        head: context,
      };
    }
  }

  private functionType(): TC.MonoType {
    let paramType = this.typeConstructor();

    if (this.match(TokenType.DoubleArrow)) {
      // We found a type constraint! For now, let's just discard it
      return this.functionType();
    } else if (this.match(TokenType.Arrow)) {
      let returnType = this.functionType();
      return {
        type: TC.Type.FnType,
        in: paramType,
        out: returnType,
      };
    } else {
      return paramType;
    }
  }

  private typeConstructor(): TC.MonoType {
    // If there's a type function identifier
    let constructor = this.typeIdentifier();

    if (constructor !== null) {
      if (constructor.type === TC.Type.TyCon) {
        let mus: TC.MonoType[] = [];
        let param: TC.MonoType;

        while ((param = this.typeTerm())) {
          mus.push(param);
        }

        return { ...constructor, mus };
      } else {
        return constructor;
      }
    }

    // Otherwise, expect a single term
    let term = this.typeTerm();
    if (term) {
      return term;
    } else {
      throw new Error("Missing type term.");
    }
  }

  private typeTerm(): TC.MonoType | null {
    if (this.match(TokenType.LeftBracket)) {
      let listParam = this.functionType();
      this.consume(
        TokenType.RightBracket,
        "Expected right bracket at end of list type."
      );
      return { type: TC.Type.TyCon, C: "List", mus: [listParam] };
    } else if (this.match(TokenType.LeftParen)) {
      let elements: MonoType[] = [];

      while (!this.match(TokenType.RightParen)) {
        if (this.isAtEnd()) {
          throw new Error("Unterminated tuple type");
        }

        if (elements.length > 0) {
          this.consume(TokenType.Comma, "Expect ',' after tuple item");
        }

        elements.push(this.functionType());
      }

      return elements.length === 1
        ? elements[0]
        : { type: "ty-app", C: "()", mus: elements };
    } else {
      return this.typeIdentifier();
    }
  }

  private typeIdentifier(): TC.MonoType | null {
    if (this.match(TokenType.Identifier)) {
      let identifier = this.previous();
      if (identifier.lexeme[0] >= "A" && identifier.lexeme[0] <= "Z") {
        return {
          type: TC.Type.TyCon,
          C: identifier.lexeme,
          mus: [],
        };
      } else {
        return {
          type: TC.Type.TyVar,
          a: identifier.lexeme,
        };
      }
    }

    return null;
  }
}
