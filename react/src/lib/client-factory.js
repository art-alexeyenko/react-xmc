import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-react';
import { getGraphQLClientFactoryConfig } from './graphql-client-factory/config';

// The GraphQLRequestClientFactory serves as the central hub for executing GraphQL requests within the application

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = () => {
  const clientConfig = getGraphQLClientFactoryConfig();

  return GraphQLRequestClient.createClientFactory(clientConfig);
};

export const clientFactory = createGraphQLClientFactory();
