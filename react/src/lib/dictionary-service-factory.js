import { GraphQLDictionaryService } from '@sitecore-jss/sitecore-jss-react';
import config from '../temp/config';
import { clientFactory } from './client-factory';

export class DictionaryServiceFactory {
  create() {
    return new GraphQLDictionaryService({
      clientFactory,
      siteName: config.sitecoreSiteName,
      /*
            The Dictionary Service needs a root item ID in order to fetch dictionary phrases for the current
            app. If your Sitecore instance only has 1 JSS App, you can specify the root item ID here;
            otherwise, the service will attempt to figure out the root item for the current JSS App using GraphQL and app name.
            rootItemId: '{GUID}'
          */
    });
  }
}

export const dictionaryServiceFactory = new DictionaryServiceFactory();
