require('dotenv').config();
const { constantCase } = require('constant-case');
const chalk = require('chalk');

/**
 * This plugin will set XM Cloud related config props.
 */
class XMCloudPlugin {
  // should come after other plugins (but before fallback)
  order = 11;

  exec(config) {
    const proxyBuildPath = process.env[`${constantCase('proxyBuildPath')}`]?.replace(/\/$/, '');
    const proxyHost = process.env[`${constantCase('reactAppProxyHost')}`];

    const sitecoreEdgeUrl =
      process.env[`${constantCase('sitecoreEdgeUrl')}`]?.replace(/\/$/, '') ||
      'https://edge-platform.sitecorecloud.io';
    const sitecoreEdgeContextId = process.env[`${constantCase('reactAppSitecoreEdgeContextId')}`];
    const personalizeScope = process.env[`${constantCase('reactAppPersonalizeScope')}`];

    if (config.sitecoreApiKey && sitecoreEdgeContextId) {
      console.log(
        chalk.yellow(
          `You have configured both 'sitecoreApiKey' and 'sitecoreEdgeContextId' values. The 'sitecoreEdgeContextId' is used instead.`
        )
      );
    }

    return Object.assign({}, config, {
      proxyBuildPath,
      proxyHost,
      sitecoreEdgeUrl,
      sitecoreEdgeContextId,
      personalizeScope,
    });
  }
}

module.exports = new XMCloudPlugin();
