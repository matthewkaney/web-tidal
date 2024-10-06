export enum TokenType {
  // Error type
  Error = "ERROR",

  // Formatting
  LineBreak = "LINE_BREAK",

  // Single-character tokens.
  LeftParen = "LEFT_PAREN",
  RightParen = "RIGHT_PAREN",
  LeftBracket = "LEFT_BRACKET",
  RightBracket = "RIGHT_BRACKET",
  LeftBrace = "LEFT_BRACE",
  RightBrace = "RIGHT_BRACE",
  Comma = "COMMA",
  Dot = "DOT",
  Semicolon = "SEMICOLON",
  Dollar = "DOLLAR",
  Colon = "COLON",

  // Arithmetic
  Minus = "MINUS",
  Plus = "PLUS",
  Slash = "SLASH",
  Star = "STAR",

  // Pattern operators
  MinusSB = "MINUS_SB", // |-|
  MinusSL = "MINUS_SL", // |-
  MinusSR = "MINUS_SR", //  -|
  PlusSB = "PLUS_SB", //   |+|
  PlusSL = "PLUS_SL", //   |+
  PlusSR = "PLUS_SR", //    +|
  SlashSB = "SLASH_SB", // |/|
  SlashSL = "SLASH_SL", // |/
  SlashSR = "SLASH_SR", //  /|
  StarSB = "STAR_SB", //   |*|
  StarSL = "STAR_SL", //   |*
  StarSR = "STAR_SR", //    *|
  RightSB = "RIGHT_SB", // |>|
  RightSL = "RIGHT_SL", // |>  (also #)
  RightSR = "RIGHT_SR", //  >|
  LeftSB = "LEFT_SB", //   |<|
  LeftSL = "LEFT_SL", //   |<
  LeftSR = "LEFT_SR", //    <|

  // One or two character tokens.
  BangEqual = "BANG_EQUAL",
  Equal = "EQUAL",
  EqualEqual = "EQUAL_EQUAL",
  Greater = "GREATER",
  GreaterEqual = "GREATER_EQUAL",
  Less = "LESS",
  LessEqual = "LESS_EQUAL",
  Arrow = "ARROW",
  DoubleArrow = "DOUBLE_ARROW",

  // Literals.
  Identifier = "IDENTIFIER",
  String = "STRING",
  Number = "NUMBER",

  // Keywords.
  And = "AND",
  Class = "CLASS",
  Else = "ELSE",
  False = "FALSE",
  Fun = "FUN",
  For = "FOR",
  If = "IF",
  Nil = "NIL",
  Or = "OR",
  Print = "PRINT",
  Return = "RETURN",
  Super = "SUPER",
  This = "THIS",
  True = "TRUE",
  Var = "VAR",
  While = "WHILE",

  EOF = "EOF",
}
