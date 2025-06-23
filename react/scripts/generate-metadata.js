const fs = require('fs');
const path = require('path');
const { Metadata, getMetadata } = require('@sitecore-jss/sitecore-jss-dev-tools');

/*
  METADATA GENERATION
  Generates the /src/environments/metadata.json file which contains application
  configuration metadata that is used for Sitecore XM Cloud integration.
*/
generateMetadata();

function generateMetadata() {
  const metadata = getMetadata();
  writeMetadata(metadata);
}

/**
 * Writes the metadata object to disk.
 * @param {Metadata} metadata metadata to write.
 */
function writeMetadata(metadata) {
  const filePath = path.resolve('src/metadata.json');
  console.log(`Writing metadata to ${filePath}`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2), { encoding: 'utf8' });
}
