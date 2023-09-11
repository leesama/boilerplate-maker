# Boilerplate Maker（模板生成器）

Boilerplate Maker 是适用于 Visual Studio Code 的扩展，它允许您轻松创建模板代码。使用此扩展，您可以生成和管理模板代码，以提高开发效率。

[English](README.md) | [中文](README_CN.md)

## 功能

- 快速创建模板代码。
- 灵活的模板创建和管理。
- 支持变量替换，根据用户输入生成自定义文件和目录。

## 安装

1. 打开 Visual Studio Code。
2. 在侧边栏中选择 **扩展** 图标。
3. 在搜索框中键入 **boilerplate-maker**。
4. 找到扩展并单击 **安装**。

或者单击 [Visual Studio Code 市场：Boilerplate Maker](https://marketplace.visualstudio.com/items?itemName=leesama-tools.boilerplate-maker)

## 使用

1. 打开 Visual Studio Code。
2. 在文件资源管理器（左侧文件面板）中右键单击要创建模板文件的文件夹。
3. 选择 `boilerplate: Create Boilerplate` 以直接创建模板文件，或选择 `boilerplate: Create Boilerplate (with rename)` 以创建模板文件并重命名它（首次执行此操作时，将在特定路径下创建名为 `boilerplate.config.cjs` 的全局配置文件以及相应的模板文件目录 `.boilerplate`。您可以查看插件设置 `globalConfigDirectory` 的默认值以获取确切路径）。
4. 选择一个模板。
5. 您可以将模板复制到项目的根目录，即您的工作区目录。如果您的工作区目录包含 `boilerplate.config.cjs` 文件，它将从工作区中读取模板文件目录 `.boilerplate`。

## 创建自定义模板

1. 在默认路径 `.boilerplate` 中创建一个模板文件夹并重命名它（文件夹名称将成为模板名称）。
2. 在模板文件夹内创建文件和文件夹结构。

## 设置

您可以在 Visual Studio Code 的设置中配置 Boilerplate Maker。

- `boilerplateMaker.templatesDirectory`：项目模板的默认路径。默认值是位于用户主目录下的路径，路径根据操作系统不同而变化：Windows - `AppData/Roaming/Code/User/boilerplate`，macOS - `Library/Application Support/Code/User/boilerplate`，Linux 和其他类 Unix 系统 - `.config/Code/User/boilerplate`。

## boilerplate.config.cjs

用于配置和自定义模板创建和替换行为的配置文件：

1. `boilerplateRootPath`：这是模板的根路径。默认情况下，模板文件将从 `.boilerplate` 文件夹加载。您可以更改此路径以适应您的项目结构。

2. `replaceFileTextFn`：这是一个用于替换复制模板文件后的文件内容的函数。当您将模板文件复制到新位置时，将调用此函数以根据需要修改文件内容。它接受三个参数：

   - `fileText`：原始文件内容。
   - `boilerplateName`：模板名称。
   - `utils`：包含有用的实用函数的对象，例如文本大小写转换的 `changeCase`。

   在此函数中，它使用正则表达式将文件中的占位符 `__boilerplateName__`、`__boilerplateNameToPascalCase__` 和 `__boilerplateNameToParamCase__` 分别替换为它们的相应值。

3. `renameFileFn`：这是一个用于重命名文件的函数。它接受三个参数：

   - `fileName`：原始文件名。
   - `boilerplateName`：模板名称。
   - `utils`：包含有用的实用函数的对象。

   在此函数中，它使用正则表达式将文件名中的 `__boilerplateName__` 占位符替换为模板名称。

4. `renameSubDirectoriesFn`：这是一个用于重命名子目录的函数。它接受三个参数：

   - `directoryName`：原始子目录名。
   - `boilerplateName`：模板名称。
   - `_utils`：包含有用的实用函数的对象。

   在此函数中，它使用 `changeCase.paramCase` 函数将模板名称转换为参数案例，并将子目录名称中的 `__boilerplateName__` 占位符替换为新的目录名称。

总之，此配置文件用于定义模板的根路径、文件内容替换规则、文件重命名规则和子目录重命名规则。通过自定义这些规则，您可以根据项目需求自动化和定制模板生成。

## 贡献

如果您发现任何问题或有改进建议，请在 [GitHub 存储库](https://github.com/yourusername/boilerplate-maker) 上打开问题或请求。

## 许可

此扩展遵循 [MIT 许可协议](LICENSE)。

---

**享受吧！** 🚀

**Boilerplate Maker** 由 [leesama](https://github.com/leesama) 开发，并根据 MIT 许可协议提供。如果您喜欢这个扩展，请在 [GitHub 存储库链接](https://github.com/leesama/boilerplate-maker) 上为它加星。
