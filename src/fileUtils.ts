import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as changeCase from "change-case";

/**
 * Get the working directory path.
 * @param context Current context
 * @param activeTextEditor Currently active text editor
 * @param workspace Workspace folder
 */
export function getWorkingPathDir(
  context: vscode.Uri,
  activeTextEditor: vscode.TextEditor,
  workspace: vscode.WorkspaceFolder
) {
  if (context) {
    const { fsPath } = context;
    const stats = fs.statSync(context.fsPath);
    return stats.isDirectory() ? fsPath : path.dirname(fsPath);
  } else if (activeTextEditor) {
    return path.dirname(activeTextEditor.document.fileName);
  } else {
    return workspace.uri.fsPath;
  }
}

/**
 * Find variable patterns in a file.
 * @param filePath File path
 */
export async function findVariablePatterns(filePath: string): Promise<string[]> {
  const stat = await fs.stat(filePath);
  const ret: string[] = [];
  if (stat.isDirectory()) {
    const files = await fs.readdir(filePath);
    const results = (
      await Promise.all(
        files.map(async (entryFilePath) => {
          return findVariablePatterns(path.resolve(filePath, entryFilePath));
        })
      )
    ).reduce((ret, result) => {
      ret.push.apply(ret, result);
      return ret;
    }, []);
    ret.push.apply(ret, results);
  } else {
    const fileText = (await fs.readFile(filePath)).toString("utf8");
    const matchPattern = /\$\$var_[a-zA-Z0-9]+/g;
    const variableInFilepath = filePath.match(matchPattern);
    variableInFilepath &&
      variableInFilepath.forEach((variable) => {
        const [, value] = variable.split("_");
        ret.push(value);
      });
    const variablesInFileText = fileText.match(matchPattern);
    variablesInFileText &&
      variablesInFileText.forEach((variable) => {
        const [, value] = variable.split("_");
        ret.push(value);
      });
  }
  return ret;
}

/**
 * Replace text in files within a directory.
 * @param filePath File path
 * @param templateName Template name
 * @param replaceFileTextFn Function to replace file text
 * @param renameFileFn Function to rename files
 * @param renameSubDirectoriesFn Function to rename subdirectories
 */
export async function replaceTextInFiles(
  filePath: string,
  templateName: string,
  replaceFileTextFn:
    | ((fileText: string, templateName: string, utilities: any) => string)
    | undefined,
  renameFileFn:
    | ((filename: string, templateName: string, utilities: any) => string)
    | undefined,
  renameSubDirectoriesFn:
    | ((directoryName: string, templateName: string, utilities: any) => string)
    | undefined
): Promise<void> {
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(filePath);
      await Promise.all(
        files.map(async (entryFilePath) => {
          return replaceTextInFiles(
            path.resolve(filePath, entryFilePath),
            templateName,
            replaceFileTextFn,
            renameFileFn,
            renameSubDirectoriesFn
          );
        })
      );
      if (typeof renameSubDirectoriesFn === "function") {
        const currDirectoryName = path.basename(filePath);
        const newDirectoryName = renameSubDirectoriesFn(
          currDirectoryName,
          templateName,
          {
            changeCase,
            path,
          }
        );
        const newPath = path.resolve(filePath, "../", newDirectoryName);
        fs.renameSync(filePath, newPath);
      }
    } else {
      const fileText = (await fs.readFile(filePath)).toString("utf8");
      if (typeof replaceFileTextFn === "function") {
        await fs.writeFile(
          filePath,
          replaceFileTextFn(fileText, templateName, { changeCase, path })
        );
        /**
         * Rename file
         * @ref https://github.com/stegano/vscode-template/issues/4
         */
        if (typeof renameFileFn === "function") {
          const filePathInfo = path.parse(filePath);
          const { base: originalFilename } = filePathInfo;
          const filename = renameFileFn(originalFilename, templateName, {
            changeCase,
            path,
          });
          const _filePath = path.resolve(filePathInfo.dir, filename);
          filename && fs.renameSync(filePath, _filePath);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Make a `.templates` folder in the workspace and create sample templates.
 * @param templateRootPath Root path for templates
 */
export async function makeSampleTemplate(templateRootPath: string): Promise<void> {
  const sourceFilePath = path.resolve(__dirname, "./assets/.templates");

  try {
    await fs.copy(sourceFilePath, templateRootPath);
  } catch (err) {
    console.error("copy error:", err);
    throw err;
  }
}
