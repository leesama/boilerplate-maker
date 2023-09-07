import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { getConfigPath } from "./configUtils";
import {
  findVariablePatterns,
  getWorkingPathDir,
  makeSampleTemplate,
  replaceTextInFiles,
} from "./fileUtils";

/**
 * Create a new template based on user input.
 * @param _context Current context
 * @param isRenameTemplate Boolean indicating if the template should be renamed
 */
async function createNew(
  _context: vscode.Uri,
  isRenameTemplate: boolean
): Promise<void> {
  try {
    // Get the path to the configuration file
    const configPath = await getConfigPath();

    // Load the configuration
    const config = await import(path.resolve(configPath, "template.config.cjs"));
    const templateRootPath = path.resolve(configPath, config.templateRootPath);

    // Create a sample template if it doesn't exist
    if (!(await fs.pathExists(templateRootPath))) {
      await makeSampleTemplate(templateRootPath);
    }

    // Determine the working directory
    const workingPathDir = getWorkingPathDir(
      _context,
      vscode.window.activeTextEditor!,
      vscode.workspace.workspaceFolders![0]
    );

    // Get the list of available template paths
    const templatePaths = await fs.readdir(templateRootPath);

    // Allow the user to choose a template
    const templateName = await vscode.window.showQuickPick(templatePaths, {
      placeHolder: "Choose a template",
    });

    // If no input data, do nothing
    if (templateName === undefined) {
      return;
    }

    // Build source and destination paths
    const srcPath = path.resolve(templateRootPath, templateName);

    // Input template name from user
    const dstTemplateName = isRenameTemplate
      ? await vscode.window.showInputBox({
          prompt: "Input a template name",
          value: templateName,
        })
      : templateName;

    const dstPath = path.resolve(workingPathDir, dstTemplateName!);

    // Find variable patterns in the template
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

    // Copy template files to the destination path
    await fs.copy(srcPath, dstPath);

    // Replace text in copied files
    await replaceTextInFiles(
      dstPath,
      dstTemplateName!,
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
      dstTemplateName!,
      replaceTextWithVariables,
      replaceTextWithVariables,
      replaceTextWithVariables
    );

    vscode.window.showInformationMessage("Template: copied!");
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
    vscode.commands.registerCommand("extension.createNew", (context) =>
      createNew(context, false)
    ),
    vscode.commands.registerCommand(
      "extension.createNewWithRename",
      (context) => createNew(context, true)
    )
  );
}

/**
 * Deactivate the extension.
 */
function deactivate() {}

export { activate, deactivate };
