import React from 'react';
import { RichText as JssRichText, useSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const ComponentContent = (props) => {
  const id = props.id;
  return (
    <div className={`component content ${props?.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-content">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props.params.RenderingIdentifier;

  if (!(props.fields && props.fields.Content) && !sitecoreContext?.route?.fields?.Content) {
    return (
      <div className={`component content ${props?.params?.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-content">[Content]</div>
        </div>
      </div>
    );
  }

  const field =
    props.fields && props.fields.Content
      ? props.fields.Content
      : sitecoreContext?.route?.fields?.Content;

  return (
    <ComponentContent styles={props?.params?.styles} id={id}>
      <JssRichText field={field} />
    </ComponentContent>
  );
};

export default Default;
