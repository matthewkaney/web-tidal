import { EditorView } from "codemirror";

export const editorTheme = EditorView.theme({
  "&": {
    fontFamily: "inherit",
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
});
