// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { isKoreanString } from "./utils/regex";
import { translateText } from "./translators";
import {
  window,
  DecorationOptions,
  Range,
  Disposable,
  TextEditorDecorationType,
  TextEditor,
  workspace,
  TextDocument,
  languages,
  Hover,
  commands,
  ExtensionContext,
} from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  let timeout: any = null;
  let editor = window.activeTextEditor;

  const decoration = window.createTextEditorDecorationType({});

  const updateDecorations = () => {
    if (!editor || !editor.document) {
      return;
    }
    let document = editor.document;
    const documentText = document.getText();
    let matchs = [];
    let match;
    let pattern = /'(.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣.?])'|"(.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣.?])"/g;
    while ((match = pattern.exec(documentText))) {
      const string = match[0];
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(match.index + string.length);
      const textTranslate = translateText(string.replace(/["']/g, ""));
      const decoration = {
        range: new Range(startPos, endPos),
        renderOptions: {
          after: {
            color: "rgba(26,26,26)",
            contentText: textTranslate,
            fontStyle: "normal",
            border: `0.5px solid white; border-radius: 2px;`,
            fontWeight: "bold",
            backgroundColor: "white",
            margin: "5px",
          },
        },
      };
      matchs.push(decoration);
    }
    editor.setDecorations(decoration, matchs);
  };

  const triggerUpdateDecorations = () => {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(updateDecorations, 0);
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = commands.registerCommand(
    "ShinhanDS.scanDocument",
    async () => {
      if (editor) {
        triggerUpdateDecorations();
      }
    }
  );

  if (editor) {
    triggerUpdateDecorations();
  }

  window.onDidChangeActiveTextEditor(
    function (activeEditor) {
      editor = activeEditor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  workspace.onDidChangeTextDocument(
    function (event) {
      if (editor && event.document === editor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  context.subscriptions.push(disposable);
}

exports.activate = activate;
