import * as vscode from "vscode";
import * as os from "os";
import * as fs from "fs-extra";
import * as path from "path";

// Function to get the default global configuration root path based on the platform
export const getDefaultGlobalConfigDirectory = () => {
  const userDir = os.homedir();

  let configFilePath: string;
  // Determine the platform and set the appropriate path
  if (process.platform === "win32") {
    configFilePath = path.join(
      userDir,
      "AppData",
      "Roaming",
      "Code",
      "User",
      "boilerplate"
    );
  } else if (process.platform === "darwin") {
    configFilePath = path.join(
      userDir,
      "Library",
      "Application Support",
      "Code",
      "User",
      "boilerplate"
    );
  } else {
    configFilePath = path.join(userDir, ".config", "Code", "User", "boilerplate");
  }
  return configFilePath;
};

export async function getWorkspaceConfigDirectory(): Promise<string> {
  const activeWorkspaceFolder = vscode.workspace.workspaceFolders![0];
  return activeWorkspaceFolder.uri.fsPath;
}

export async function getGlobalConfigDirectory(): Promise<string> {
  const config = vscode.workspace.getConfiguration("boilerplate maker");
  const globalConfigDirectory = config.get<string>("globalConfigDirectory");
  return globalConfigDirectory || getDefaultGlobalConfigDirectory();
}

export async function getConfigPath(): Promise<string> {
  const workspaceConfigPath = await getWorkspaceConfigDirectory();
  const globalConfigPath = await getGlobalConfigDirectory();

  if (await fs.pathExists(path.resolve(workspaceConfigPath, "boilerplate.config.cjs"))) {
    return workspaceConfigPath; // Use workspace configuration if it exists
  } else if (await fs.pathExists(path.resolve(globalConfigPath, "boilerplate.config.cjs"))) {
    return globalConfigPath; // Use global configuration if it exists
  } else {
    await makeboilerplateConfigJs(path.resolve(globalConfigPath, "boilerplate.config.cjs"));
    return globalConfigPath; // Create and use global configuration if none exists
  }
}

// Function to make a default configuration file
async function makeboilerplateConfigJs(configFilePath: string): Promise<void> {
  const sourceFilePath = path.resolve(
    __dirname,
    "./assets",
    "boilerplate.config.cjs"
  );
  try {
    // Use fs-extra's fs.copy function to copy the file
    await fs.copy(sourceFilePath, configFilePath);
  } catch (err) {
    console.error("Copy error:", err);
    throw err;
  }
}
