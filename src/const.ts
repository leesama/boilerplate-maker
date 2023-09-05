import * as os from "os";
import * as path from "path";

// Function to get the global configuration root path
const getGlobalConfigRootPath = (): string => {
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
      "template"
    );
  } else if (process.platform === "darwin") {
    configFilePath = path.join(
      userDir,
      "Library",
      "Application Support",
      "Code",
      "User",
      "template"
    );
  } else {
    configFilePath = path.join(userDir, ".config", "Code", "User", "template");
  }
  return configFilePath;
};

// Get the global configuration root path
const globalConfigRootPath: string = getGlobalConfigRootPath();

export { globalConfigRootPath };
