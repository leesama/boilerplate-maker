import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { getConfigPath } from "./configUtils";
import {
  findVariablePatterns,
  getWorkingPathDir,
  makeSampleboilerplate,
  replaceTextInFiles,
} from "./fileUtils";

/**
 * Create a new boilerplate based on user input.
 * @param _context Current context
 * @param isRenameboilerplate Boolean indicating if the boilerplate should be renamed
 */
async function createNew(
  _context: vscode.Uri,
  isRenameboilerplate: boolean
): Promise<void> {
  try {
    // Get the path to the configuration file
    const configPath = await getConfigPath();

    // Load the configuration
    const config = await import(path.resolve(configPath, "boilerplate.config.cjs"));
    const boilerplateRootPath = path.resolve(configPath, config.boilerplateRootPath);

    // Create a sample boilerplate if it doesn't exist
    if (!(await fs.pathExists(boilerplateRootPath))) {
      await makeSampleboilerplate(boilerplateRootPath);
    }

    // Determine the working directory
    const workingPathDir = getWorkingPathDir(
      _context,
      vscode.window.activeTextEditor!,
      vscode.workspace.workspaceFolders![0]
    );

    // Get the list of available boilerplate paths
    const boilerplatePaths = await fs.readdir(boilerplateRootPath);

    // Allow the user to choose a boilerplate
    const boilerplateName = await vscode.window.showQuickPick(boilerplatePaths, {
      placeHolder: "Choose a boilerplate",
    });

    // If no input data, do nothing
    if (boilerplateName === undefined) {
      return;
    }

    // Build source and destination paths
    const srcPath = path.resolve(boilerplateRootPath, boilerplateName);

    // Input boilerplate name from user
    const dstboilerplateName = isRenameboilerplate
      ? await vscode.window.showInputBox({
          prompt: "Input a boilerplate name",
          value: boilerplateName,
        })
      : boilerplateName;

    const dstPath = path.resolve(workingPathDir, dstboilerplateName!);

    // Find variable patterns in the boilerplate
    const variables = [...new Set(await findVariablePatterns(srcPath))];

    const COMMAND_SKIP = "Skip...";
    const replaceValues: Record<string, string> = {};

    while (variables.length > 0) {
      try {
        /**
         * Selected variableName
         */
        const selectedVariableName = await vscode.window.showQuickPick(
          [...variables, COMMAND_SKIP],
          {
            placeHolder:
              "To change the value of a variable, select the variable name.",
          }
        );

        if (selectedVariableName === COMMAND_SKIP) {
          break;
        }

        /**
         * Input value by user
         */
        const selectedVariableValue = await vscode.window.showInputBox({
          prompt: `Input a ${selectedVariableName} value`,
          value: "",
        });

        replaceValues[selectedVariableName!] = selectedVariableValue!;
        variables.splice(variables.indexOf(selectedVariableName!), 1);
      } catch (e) {
        break;
      }
    }

    // Copy boilerplate files to the destination path
    await fs.copy(srcPath, dstPath);

    // Replace text in copied files
    await replaceTextInFiles(
      dstPath,
      dstboilerplateName!,
      config.replaceFileTextFn,
      config.renameFileFn,
      config.renameSubDirectoriesFn
    );

    // Replace variable placeholders in files
    const replaceTextWithVariables = (target: any) => {
      return Object.keys(replaceValues).reduce((ret, name) => {
        return ret.replace(
          RegExp(`\\$\\$var_${name}`, "g"),
          replaceValues[name]
        );
      }, target);
    };

    await replaceTextInFiles(
      dstPath,
      dstboilerplateName!,
      replaceTextWithVariables,
      replaceTextWithVariables,
      replaceTextWithVariables
    );

    vscode.window.showInformationMessage("boilerplate: copied!");
  } catch (e: any) {
    console.error(e.stack);
    vscode.window.showErrorMessage(e.message);
  }
}

/**
 * Activate the extension.
 * @param context Extension context
 */
function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.createBoilerplate", (context) =>
      createNew(context, false)
    ),
    vscode.commands.registerCommand(
      "extension.createBoilerplateWithRename",
      (context) => createNew(context, true)
    )
  );
}

/**
 * Deactivate the extension.
 */
function deactivate() {}

export { activate, deactivate };
