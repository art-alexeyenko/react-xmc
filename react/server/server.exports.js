import clientFactory from '../src/lib/GraphQLClientFactory';
import { getGraphQLClientFactoryConfig } from '../src/lib/graphql-client-factory/config';
import { dictionaryServiceFactory } from '../src/lib/dictionary-service-factory';
import { layoutServiceFactory } from '../src/lib/layout-service-factory';
import config from '../src/temp/config';
import { components } from '../src/temp/componentBuilder';
import metadata from '../src/metadata.json';
/**
 * Define the required configuration values to be exported from the server.bundle.ts.
 */

const defaultLanguage = config.defaultLanguage;
const sitecoreSiteName = config.sitecoreSiteName;
const personalizeScope = config.personalizeScope;
const getClientFactoryConfig = getGraphQLClientFactoryConfig;

export {
  clientFactory,
  getClientFactoryConfig,
  dictionaryServiceFactory,
  layoutServiceFactory,
  defaultLanguage,
  sitecoreSiteName,
  personalizeScope,
  components,
  metadata,
};
