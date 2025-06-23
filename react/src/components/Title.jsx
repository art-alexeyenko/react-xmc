import React from 'react';
import { Link, Text, useSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const ComponentContent = (props) => {
  const id = props.id;
  return (
    <div className={`component title ${props?.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-title">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props) => {
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const { sitecoreContext } = useSitecoreContext();
  const text = datasource?.field?.jsonValue || {};
  const link = {
    value: {
      href: datasource?.url?.path,
      title: datasource?.field?.jsonValue?.value,
    },
  };
  if (sitecoreContext.pageState !== 'normal') {
    link.value.querystring = `sc_site=${datasource?.url?.siteName}`;
    if (!text?.value) {
      text.value = 'Title field';
      link.value.href = '#';
    }
  }

  return (
    <ComponentContent styles={props?.params?.styles} id={props?.params?.RenderingIdentifier}>
      <>
        {sitecoreContext.pageEditing ? (
          <Text field={text} />
        ) : (
          <Link field={link}>
            <Text field={text} />
          </Link>
        )}
      </>
    </ComponentContent>
  );
};

export default Default;
