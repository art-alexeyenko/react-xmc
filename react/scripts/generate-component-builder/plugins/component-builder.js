const path = require('path');
const fs = require('fs');
const {
  ComponentFile,
  PackageDefinition,
  getComponentList,
} = require('@sitecore-jss/sitecore-jss-dev-tools');
const chokidar = require('chokidar');

/**
 * Run watch mode, watching on @var paths
 * @param {string[]} paths paths to watch by chokidar
 * @param {Function<void>} cb callback to run on file change
 */
function watchItems(paths, cb) {
  chokidar
    .watch(paths, { ignoreInitial: true, awaitWriteFinish: true })
    .on('add', cb)
    .on('unlink', cb);
}

// Default destination path for component builder
const componentBuilderOutputPath = 'src/temp/componentBuilder.js';
const defaultComponentRootPath = 'src/components';

/**
 * Generate component builder template
 * @param {(PackageDefinition | ComponentFile)[]} components components to include in component builder
 * @param {string} distPath destination path for component builder
 * @returns generated component builder template
 */
const getComponentBuilderTemplate = (components, distPath) => {
  const componentFiles = components.filter((component) => component.componentName);
  const packages = components.filter((component) => component.components);

  return `/* eslint-disable */
// Do not edit this file, it is auto-generated at build time!
// See scripts/generate-component-builder/index.js to modify the generation of this file.

import { ComponentBuilder } from '@sitecore-jss/sitecore-jss-react';
${packages
  .map((pkg) => {
    const list = pkg.components.map((c) => c.moduleName).join(', ');
    return `import { ${list} } from '${pkg.name}';\n`;
  })
  .join('')}
${componentFiles
  .map((component) => {
    const sourcePath = path.relative(path.dirname(distPath), component.path).replace(/\\/g, '/');
    return `import ${component.moduleName} from '${sourcePath}';`;
  })
  .join('\n')}

export const components = new Map();
${packages
  .map((p) =>
    p.components.map(
      (component) => `components.set('${component.componentName}', ${component.moduleName});\n`
    )
  )
  .flat()
  .join('')}
${componentFiles
  .map((component) => `components.set('${component.componentName}', ${component.moduleName});`)
  .join('\n')}

const componentBuilder = new ComponentBuilder({ components });

export const componentFactory = componentBuilder.getComponentFactory();
`;
};

function generateComponentBuilder({
  componentRootPath = defaultComponentRootPath,
  packages = [],
  components = [],
  watch,
}) {
  if (watch) {
    watchComponentBuilder({ componentRootPath, packages, components });
  } else {
    writeComponentBuilder({ componentRootPath, packages, components });
  }
}

function watchComponentBuilder({ componentRootPath, packages, components }) {
  console.log(`Watching for changes to component builder sources in ${componentRootPath}...`);

  watchItems(
    [componentRootPath],
    writeComponentBuilder.bind(null, { componentRootPath, packages, components })
  );
}

/**
 * Write component builder to file
 * @param {object} settings settings for component builder generation
 * @param {string} settings.componentRootPath root path to components
 * @param {PackageDefinition[]} settings.packages packages to include in component builder
 * @param {ComponentFile[]} settings.components list of components to include in component builder
 */
function writeComponentBuilder({ componentRootPath, packages, components }) {
  const items = [...packages, ...components, ...getComponentList(componentRootPath)];

  const componentBuilderPath = path.resolve(componentBuilderOutputPath);
  const fileContent = getComponentBuilderTemplate(items, componentBuilderPath);
  console.log(`Writing component builder to ${componentBuilderPath}`);
  fs.writeFileSync(componentBuilderPath, fileContent, {
    encoding: 'utf8',
  });
}

/**
 * Generates the component builder file.
 */
class ComponentBuilderPlugin {
  order = 9999;

  exec(config) {
    generateComponentBuilder(config);
  }
}

module.exports = new ComponentBuilderPlugin();
