module.exports = {
  // Define the root path of your boilerplate templates
  boilerplateRootPath: "./.boilerplate",

  // This function is executed after copying a boilerplate file
  replaceFileTextFn: (fileText, boilerplateName, utils) => {
    // Utilize the 'change-case' library for text transformations
    const { changeCase } = utils;

    // Customize the file content as needed
    return fileText
      .replace(/__boilerplateName__/g, boilerplateName)
      .replace(
        /__boilerplateNameToPascalCase__/g,
        changeCase.pascalCase(boilerplateName)
      )
      .replace(
        /__boilerplateNameToParamCase__/g,
        changeCase.paramCase(boilerplateName)
      )
      .replace(
        /__boilerplateNameToCamelCase__/g,
        changeCase.camelCase(boilerplateName)
      );
  },

  // Rename the copied file based on the boilerplate name
  renameFileFn: (fileName, boilerplateName, utils) => {
    const { path } = utils;
    const { base } = path.parse(fileName);

    // Replace placeholders with the actual boilerplate name
    return base.replace(/__boilerplateName__/gm, boilerplateName);
  },

  // Rename subdirectories using the boilerplate name
  renameSubDirectoriesFn: (directoryName, boilerplateName, _utils) => {
    const { changeCase } = _utils;

    // Convert the boilerplate name to param case for directory renaming
    const newDirectoryName = changeCase.paramCase(boilerplateName);

    // Replace placeholders with the new directory name
    return directoryName.replace(/__boilerplateName__/g, newDirectoryName);
  },
};
