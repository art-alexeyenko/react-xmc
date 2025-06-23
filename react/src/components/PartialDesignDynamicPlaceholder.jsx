import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';

const PartialDesignDynamicPlaceholder = (props) => (
  <Placeholder name={props.rendering?.params?.sig || ''} rendering={props.rendering} />
);

export default PartialDesignDynamicPlaceholder;
