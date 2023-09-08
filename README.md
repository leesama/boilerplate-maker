# Boilerplate Maker

Boilerplate Maker 是一个用于在 Visual Studio Code 中创建模板代码的扩展程序。您可以使用此扩展程序轻松地生成和管理模板代码，以提高开发的效率。

## 特性

- 快速创建模板代码
- 灵活的模板创建和管理
- 支持变量替换，根据用户输入自定义生成文件和目录

## 安装

1. 打开 Visual Studio Code。
2. 在侧边栏中选择 **扩展** 图标。
3. 在搜索框中输入 **Boilerplate Maker**。
4. 找到扩展，并点击 **安装**。

## 使用说明

1. 打开 Visual Studio Code。
2. 在资源管理器（左侧的文件面板）中右键点击需要创建模板文件的文件夹。
3. 选择 `boilerplate: Create Boilerplate`，直接创建模板文件，或选择 `boilerplate: Create Boilerplate (with rename)`，创建模板文件并重命名。（第一次执行创建会在用户的主目录路径下的特定路径下创建全局配置文件 `boilerplate.config.cjs` 和全局配置对应的模板文件目录 `.boilerplate`，具体路径查看插件设置项 `globalConfigDirectory` 的默认值）
4. 选择模板。
5. 可以复制模板到项目的根目录下，也就是工作区目录。如果工作区目录有 `boilerplate.config.cjs` 文件，将读取工作区的模板文件目录 `.boilerplate`。

## 创建自定义模板

1. 在默认路径 `.boilerplate` 下创建一个模板文件夹，并重命名它（文件夹名称将成为模板名称）。
2. 在模板文件夹中创建文件和文件夹结构。

## 设置

您可以在 Visual Studio Code 的设置中配置 Boilerplate Maker。

- `boilerplateMaker.templatesDirectory`：项目模板的默认路径。默认值为当前用户主目录下的路径，不同系统的路径有差异，Windows - AppData/Roaming/Code/User/boilerplate，macOS - Library/Application Support/Code/User/boilerplate，Linux 和其他类似的 Unix 系统 - .config/Code/User/boilerplate。

## boilerplate.config.cjs

用于配置和自定义模板的创建和替换行为：

1. `boilerplateRootPath`：这是模板的根路径。默认情况下，模板文件将从 `.boilerplate` 文件夹加载。您可以将此路径更改为其他位置，以适应您的项目结构。

2. `replaceFileTextFn`：这是一个函数，用于在复制模板文件后对文件内容进行替换。当您复制模板文件到新位置时，此函数将被调用，以便根据需要修改文件内容。它接受三个参数：

   - `fileText`：原始文件内容。
   - `boilerplateName`：模板的名称。
   - `utils`：一个对象，其中包含有用的工具函数，例如 `changeCase` 用于文本大小写转换。

   在这个函数中，它使用正则表达式替换了文件中的占位符 `__boilerplateName__`，`__boilerplateNameToPascalCase__` 和 `__boilerplateNameToParamCase__`，将它们替换为相应的值。

3. `renameFileFn`：这是一个函数，用于重命名文件。它接受三个参数：

   - `fileName`：原始文件名。
   - `boilerplateName`：模板的名称。
   - `utils`：包含有用工具函数的对象。

   在这个函数中，它使用正则表达式替换了文件名中的 `__boilerplateName__` 占位符，将其替换为模板的名称。

4. `renameSubDirectoriesFn`：这是一个函数，用于重命名子目录。它接受三个参数：

   - `directoryName`：原始子目录名称。
   - `boilerplateName`：模板的名称。
   - `_utils`：包含有用工具函数的对象。

   在这个函数中，它使用 `changeCase.paramCase` 函数将模板的名称转换为参数命名风格，并将子目录名称中的 `\_\_boilerplateName

\_\_` 占位符替换为新的目录名称。

总之，这个配置文件用于定义模板的根路径、文件内容替换规则、文件重命名规则和子目录重命名规则。通过自定义这些规则，您可以根据项目需求自动化生成和定制模板。

## 贡献

如果您发现任何问题或有改进建议，请在 [GitHub 存储库](https://github.com/yourusername/boilerplate-maker) 上提出问题或请求。

## 许可证

此扩展程序遵循 [MIT 许可证](LICENSE)。

---

**Enjoy!** 🚀

**Boilerplate Maker** 是由 [您的名字](https://github.com/yourusername) 开发的，并在 MIT 许可证下提供。如果您喜欢这个扩展程序，请给它一个星星 [GitHub 存储库链接](https://github.com/yourusername/boilerplate-maker)。
