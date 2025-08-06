import * as vscode from "vscode";
import * as documentation from "./documentation.json";


export function activate(context: vscode.ExtensionContext) {
    let hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: "file", language: "pbat" },
        {
            provideHover(document, position, token) {
                const wordRange = document.getWordRangeAtPosition(position);
                if (wordRange) {
                    const word = document.getText(wordRange);
                    let wordDocumentation = (documentation as Record<string, string>)[word.toUpperCase()];
                    if (wordDocumentation) {
                        return new vscode.Hover(wordDocumentation);
                    }
                }
            }
        }
    );
    let completionProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "pbat" },
        {
            provideCompletionItems(document, position, token) {
                return Object.keys(documentation).map((key) => new vscode.CompletionItem(key.toUpperCase(), vscode.CompletionItemKind.Keyword));
            }
        }
    );
    context.subscriptions.push(hoverProvider);
    context.subscriptions.push(completionProvider);
}

export function deactivate() {}
