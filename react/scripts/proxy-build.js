const config = require('../src/temp/config');
const { cpSync, rmSync } = require('fs');

// Executed at the end of the build process (jss build) to move the build output to the proxy build path

const proxyBuildPath = config.proxyBuildPath || '../node-xmcloud-proxy/dist';

try {
  console.log('Moving build output to proxy build path:', config.proxyBuildPath);

  rmSync(proxyBuildPath, { recursive: true, force: true });
  cpSync('./build', proxyBuildPath, { recursive: true });

  console.log('Proxy build prepared successfully!');
} catch (error) {
  console.error('Error preparing proxy build:', error);
}
