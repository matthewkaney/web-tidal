import { TokenType } from "../scan/TokenType";
import { BaseParser } from "../parse/BaseParser";

import { TypeChecker as TC, MonoType, PolyType, makeContext } from "./Types";
import { generalise } from "./Utilities";

export class TypeParser extends BaseParser<PolyType> {
  parse() {
    // TODO: Check if we've reached the end
    return generalise(makeContext({}), this.functionType());
  }

  parseClass() {
    return this.typeConstructor();
  }

  parseQualifiedType() {
    // TODO: generalize
    return this.qualifiedType();
  }

  private qualifiedType(): TC.Qualified<MonoType> {
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

  private functionType(): MonoType {
    let paramType = this.typeConstructor();

    if (this.match(TokenType.Arrow)) {
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

  private typeConstructor(): MonoType {
    // If there's a type function identifier
    let constructor = this.typeIdentifier();

    if (constructor !== null) {
      if (constructor.type === TC.Type.TyCon) {
        let mus: MonoType[] = [];
        let param: MonoType;

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

  private typeTerm(): MonoType | null {
    if (this.match(TokenType.LeftBracket)) {
      let listParam = this.functionType();
      this.consume(
        TokenType.RightBracket,
        "Expected right bracket at end of list type."
      );
      return { type: TC.Type.TyCon, C: "List", mus: [listParam] };
    } else if (this.match(TokenType.LeftParen)) {
      // TODO: Implement
      // if (this.match(TokenType.RightParen)) {
      //   return { type: "Unit" };
      // }

      let parenContents = this.functionType();
      this.consume(
        TokenType.RightParen,
        "Expected right paren at end of parenthesized expression."
      );
      return parenContents;
    } else {
      return this.typeIdentifier();
    }
  }

  private typeIdentifier(): MonoType | null {
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
