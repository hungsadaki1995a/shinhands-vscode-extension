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
import { isTextValid } from "./utils/format";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  let timeout: any = null;
  let editor = window.activeTextEditor;

  const decoration = window.createTextEditorDecorationType({});

  const updateDecorations = async () => {
    if (!editor || !editor.document) {
      return;
    }
    let document = editor.document;
    const documentText = document.getText();
    let matchs = [];
    let match;
    // \u3131-\u314e  Matches a character in the range "ㄱ" to "ㅎ" (char code 12593 to 12622). Case sensitive.
    // \u314f-\u3163  Matches a character in the range "ㅏ" to "ㅣ" (char code 12623 to 12643). Case sensitive.
    // \uac00-\ud7a3  Matches a character in the range "가" to "힣" (char code 44032 to 55203). Case sensitive.
    let koreanCharacterPattern = "\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3";
    let pattern =
      /(?=.*[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3])['">\\r\\n\s][\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3|\sID.?,/\dIP:]+['"<\\r\\n\s]/g;
    while ((match = pattern.exec(documentText))) {
      const string = match[0];
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(
        match.index + string.replace("<", "").trimEnd().length
      );
      if (!isTextValid(string)) {
        continue;
      }
      const textTranslate = await translateText(string.replace(/["']/g, ""));
      if (textTranslate) {
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
