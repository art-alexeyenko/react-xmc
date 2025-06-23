import { getEdgeProxyContentUrl } from './graphql-edge-proxy';
import config from '../../temp/config';

/**
 * Gets the configuration for the GraphQLRequestClientFactory
 * @returns GraphQLRequestClientFactoryConfig
 */
export const getGraphQLClientFactoryConfig = () => {
  let clientConfig;

  // Server side requests should go directly to the Sitecore, browser requests should go through the proxy.
  const isServer = typeof window === 'undefined';
  // If we are in a production environment we are going to use Node XM Cloud proxy
  const isProduction = config.production === 'true';

  if (isProduction) {
    if (config.sitecoreEdgeContextId) {
      clientConfig = {
        endpoint: isServer
          ? getEdgeProxyContentUrl(config.sitecoreEdgeContextId, config.sitecoreEdgeUrl)
          : getEdgeProxyContentUrl(config.sitecoreEdgeContextId, ''),
      };
    } else if (config.graphQLEndpoint && config.sitecoreApiKey) {
      // we ignore ssr-proxy and query CM directly in case apiKey is used (i.e. in dev docker deployments)
      clientConfig = {
        endpoint: config.graphQLEndpoint,
        apiKey: config.sitecoreApiKey,
      };
    }
  } else {
    if (config.sitecoreEdgeContextId) {
      clientConfig = {
        endpoint: getEdgeProxyContentUrl(config.sitecoreEdgeContextId, config.sitecoreEdgeUrl),
      };
    } else if (config.graphQLEndpoint && config.sitecoreApiKey) {
      clientConfig = {
        endpoint: config.graphQLEndpoint,
        apiKey: config.sitecoreApiKey,
      };
    }
  }

  if (!clientConfig?.endpoint) {
    throw new Error(
      'Please configure either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }

  return clientConfig;
};
