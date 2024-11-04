import { EditorView, basicSetup } from "codemirror";
import { Diagnostic, linter } from "@codemirror/lint";

import { StreamLanguage } from "@codemirror/language";
import { haskell } from "@codemirror/legacy-modes/mode/haskell";

// import { evaluation } from "@management/cm-evaluate";

// import { console as editorConsole } from "./console";

// import { editorTheme } from "./theme";

// @ts-ignore
import { dracula } from "thememirror/dist/index.js";
import { makePatternDiagram, PatternDiagram } from "./visualizer";

import { Scanner } from "../compiler/scan/Scanner";
import { Parser } from "../compiler/parse/Parser";
import { ErrorReporter } from "../compiler/parse/Reporter";
import { Interpreter } from "../compiler/Interpreter";

import { getOperators } from "../compiler/parse/API";

import { Pattern, bindings, typeBindings } from "../strudel";

import { TypeChecker } from "../compiler/typecheck/Typechecker";

// async function updateURLField(input: HTMLInputElement, doc: string) {
//   const stream = new ReadableStream({
//     start: (controller) => {
//       controller.enqueue(doc);
//       controller.close();
//     },
//   })
//     .pipeThrough(new TextEncoderStream())
//     .pipeThrough<Uint8Array>(new CompressionStream("deflate-raw"));

//   let output = "";

//   for await (let chunk of stream) {
//     output += Array.from(chunk, (byte) => String.fromCodePoint(byte)).join("");
//   }

//   input.value =
//     window.location.origin + window.location.pathname + "?" + btoa(output);
// }

// async function decodeDoc(encodedDoc: string) {
//   const stream = new ReadableStream({
//     start: (controller) => {
//       const binString = atob(encodedDoc);
//       controller.enqueue(
//         Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0)
//       );
//       controller.close();
//     },
//   })
//     .pipeThrough<Uint8Array>(new DecompressionStream("deflate-raw"))
//     .pipeThrough(new TextDecoderStream());

//   let doc = "";

//   for await (let chunk of stream) {
//     doc += chunk;
//   }

//   return doc;
// }

const autosave = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    const doc = update.state.doc.toString();
    localStorage.setItem("document", doc);

    // if (window.location.search) {
    //   window.history.pushState(undefined, "", window.location.pathname);
    // }

    // let urlField = document.getElementById("url");
    // if (urlField instanceof HTMLInputElement) {
    //   updateURLField(urlField, doc);
    // }
  }
});

// const evalTheme = EditorView.theme({
//   "@keyframes cm-eval-flash": {
//     from: { backgroundColor: "#FFFFFF" },
//     to: { backgroundColor: "#FFFFFF00" },
//   },
//   "& .cm-evaluated": { animation: "cm-eval-flash 0.5s" },
// });

// const consoleComponent = editorConsole();

// function handleEvaluation(code: string) {
//   let reporter = new ErrorReporter();

//   try {
//     const scanner = new Scanner(code);
//     const tokens = scanner.scanTokens();
//     const parser = new Parser(tokens, getOperators(bindings), reporter);
//     const stmts = parser.parse();

//     renamer(stmts, bindings, reporter);

//     if (!reporter.hasError) {
//       let typechecker = new TypeChecker(reporter, typeBindings);

//       for (let stmt of stmts) {
//         let [sub, expr] = typechecker.check(stmt);
//         generateTypeDiagnostics(sub, expr).forEach((annotation) => {
//           if (annotation.severity === "error") {
//             reporter.error(annotation.from, annotation.to, annotation.message);
//           }
//         });
//       }
//     }

//     if (reporter.hasError) {
//       consoleComponent.update({
//         input: code,
//         success: false,
//         text:
//           "Error: " + reporter.errors.map((error) => error.message).join("\n"),
//       });
//     } else {
//       const interpreter = new Interpreter(reporter, bindings);

//       let results = interpreter.interpret(stmts);
//       let text = [...results, ...reporter.errors].join("\n");

//       if (text === "") {
//         return;
//       }

//       consoleComponent.update({
//         input: code,
//         success: true,
//         text,
//       });
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       consoleComponent.update({
//         input: code,
//         success: false,
//         text: "Error: " + error.message,
//       });
//     }
//   }
// }

function autoRun(diagram: PatternDiagram) {
  const listener = EditorView.updateListener.of((update) => {
    // Skip updates where the doc hasn't changed
    if (!update.docChanged) {
      return;
    }

    let reporter = new ErrorReporter();

    try {
      const scanner = new Scanner(update.state.doc.toString());
      const tokens = scanner.scanTokens();
      const parser = new Parser(tokens, getOperators(bindings), reporter);
      const stmts = parser.parse();

      renamer(stmts, bindings, reporter);

      const typechecker = new TypeChecker(reporter, typeBindings);
      typechecker.check(stmts[0]);

      const interpreter = new Interpreter(reporter, bindings);

      let [result] = interpreter.interpret(stmts);

      if (result instanceof Pattern) {
        diagram.setPattern(result);
      }
    } catch (e) {}
  });

  return listener;
}

// linter((view) => {
//   try {
//     let reporter = new ErrorReporter();

//     const scanner = new Scanner(view.state.doc.toString());
//     const tokens = scanner.scanTokens();
//     const parser = new Parser(tokens, getOperators(bindings), reporter);
//     const stmts = parser.parse();

//     let diagnostics: Diagnostic[] = [];

//     // Run renamer to check for undefined variables
//     renamer(stmts, bindings, reporter);

//     const typechecker = new TypeChecker(reporter, typeBindings);

//     for (let stmt of stmts) {
//       let [sub, expr] = typechecker.check(stmt);

//       diagnostics = diagnostics.concat(generateTypeDiagnostics(sub, expr));
//     }

//     if (reporter.hasError) {
//       return reporter.errors.map(({ from, to, message }) => ({
//         from,
//         to,
//         message,
//         severity: "error",
//       }));
//     } else {
//       return diagnostics;
//     }
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// });

// import { Expr } from "../compiler/parse/AST/Expr";
// import {
//   TypeInfo,
//   TypeInfoAnnotation,
//   getType,
// } from "../compiler/typecheck/Annotations";
import { renamer } from "../compiler/rename/Renamer";
// import { Substitution } from "../compiler/typecheck/Utilities";

// function generateTypeDiagnostics(
//   sub: Substitution,
//   expr: Expr<TypeInfo>
// ): Diagnostic[] {
//   // Dispense with the simplest cases
//   switch (expr.is) {
//     case Expr.Is.Grouping:
//       return generateTypeDiagnostics(sub, expr.expression);
//     case Expr.Is.Empty:
//       return [];
//   }

//   // Now, check for a type annotation
//   let { typeAnnotation } = expr;
//   if (typeAnnotation) {
//     typeAnnotation.apply(sub);
//     return [typeAnnotation];
//   }

//   switch (expr.is) {
//     case Expr.Is.Variable:
//     case Expr.Is.Literal:
//       let type = getType(expr);
//       return type ? [new TypeInfoAnnotation(expr, sub(type))] : [];

//     case Expr.Is.Application:
//     case Expr.Is.Binary:
//       return generateTypeDiagnostics(sub, expr.left).concat(
//         generateTypeDiagnostics(sub, expr.right)
//       );
//     case Expr.Is.Section:
//       return generateTypeDiagnostics(sub, expr.expression);
//     case Expr.Is.List:
//       return expr.items.flatMap((e) => generateTypeDiagnostics(sub, e));
//     default:
//       return expr satisfies never;
//   }
// }

window.addEventListener("load", async () => {
  let doc: string;
  // let search = window.location.search;
  // if (search) {
  //   doc = await decodeDoc(search.slice(1));
  // } else {
  doc = localStorage.getItem("document") ?? "";
  // }

  const patternDiagram = makePatternDiagram();

  new EditorView({
    doc,
    extensions: [
      basicSetup,
      StreamLanguage.define(haskell),
      // parseLinter,
      autosave,
      dracula,
      // editorTheme,
      // evalTheme,
      autoRun(patternDiagram),
    ],
    parent: document.getElementById("editor") ?? undefined,
  });

  document.getElementById("output")?.appendChild(patternDiagram.dom);
});
