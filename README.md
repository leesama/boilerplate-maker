# Boilerplate Maker

Boilerplate Maker is an extension for Visual Studio Code that allows you to create template code easily. With this extension, you can generate and manage template code to enhance your development efficiency.

[English](README.md) | [中文](README_CN.md)

## Features

- Quickly create template code.
- Flexible template creation and management.
- Support for variable replacement to generate files and directories customized based on user input.

## Installation

1. Open Visual Studio Code.
2. Select the **Extensions** icon in the sidebar.
3. Type **Boilerplate Maker** in the search box.
4. Find the extension and click **Install**.

## Usage

1. Open Visual Studio Code.
2. Right-click on the folder in the file explorer (left-hand file panel) where you want to create a template file.
3. Select `boilerplate: Create Boilerplate` to create a template file directly, or choose `boilerplate: Create Boilerplate (with rename)` to create a template file and rename it. (The first time you execute this, it will create a global configuration file named `boilerplate.config.cjs` and a corresponding template file directory named `.boilerplate` in a specific path under your user's home directory. You can check the default value of the plugin setting `globalConfigDirectory` for the exact path.)
4. Choose a template.
5. You can copy the template to the root directory of your project, which is your workspace directory. If your workspace directory contains a `boilerplate.config.cjs` file, it will read the template file directory `.boilerplate` from the workspace.

## Creating Custom Templates

1. Create a template folder in the default path `.boilerplate` and rename it (the folder name will become the template name).
2. Create a file and folder structure inside the template folder.

## Settings

You can configure Boilerplate Maker in Visual Studio Code's settings.

- `boilerplateMaker.templatesDirectory`: The default path for project templates. The default value is a path under your user's home directory, and the path varies depending on the operating system: Windows - `AppData/Roaming/Code/User/boilerplate`, macOS - `Library/Application Support/Code/User/boilerplate`, Linux and other Unix-like systems - `.config/Code/User/boilerplate`.

## boilerplate.config.cjs

Used to configure and customize the creation and replacement behavior of templates:

1. `boilerplateRootPath`: This is the root path of the template. By default, template files will be loaded from the `.boilerplate` folder. You can change this path to another location to fit your project structure.

2. `replaceFileTextFn`: This is a function used to replace file contents after copying template files. When you copy a template file to a new location, this function is called to modify the file contents as needed. It accepts three parameters:

   - `fileText`: The original file content.
   - `boilerplateName`: The name of the template.
   - `utils`: An object that contains useful utility functions, such as `changeCase` for text case conversion.

   In this function, it uses regular expressions to replace placeholders `__boilerplateName__`, `__boilerplateNameToPascalCase__`, and `__boilerplateNameToParamCase__` in the file with their respective values.

3. `renameFileFn`: This is a function used to rename files. It accepts three parameters:

   - `fileName`: The original file name.
   - `boilerplateName`: The name of the template.
   - `utils`: An object containing useful utility functions.

   In this function, it uses a regular expression to replace the `__boilerplateName__` placeholder in the file name with the template name.

4. `renameSubDirectoriesFn`: This is a function used to rename subdirectories. It accepts three parameters:

   - `directoryName`: The original subdirectory name.
   - `boilerplateName`: The name of the template.
   - `_utils`: An object containing useful utility functions.

   In this function, it uses the `changeCase.paramCase` function to convert the template name to parameter case and replace the `__boilerplateName__` placeholder in the subdirectory name with the new directory name.

In summary, this configuration file is used to define the template's root path, file content replacement rules, file renaming rules, and subdirectory renaming rules. By customizing these rules, you can automate and customize template generation according to your project requirements.

## Contribution

If you find any issues or have suggestions for improvement, please open issues or requests on the [GitHub repository](https://github.com/yourusername/boilerplate-maker).

## License

This extension follows the [MIT License](LICENSE).

---

**Enjoy!** 🚀

**Boilerplate Maker** was developed by [leesama](https://github.com/leesama) and is provided under the MIT License. If you like this extension, please give it a star on the [GitHub repository link](https://github.com/leesama/boilerplate-maker).
