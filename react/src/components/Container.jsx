import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';

const DefaultContainer = (props) => {
  const containerStyles = props?.params?.Styles ?? '';
  const styles = `${props?.params?.GridParameters} ${containerStyles}`.trimEnd();
  const phKey = `container-${props?.params?.DynamicPlaceholderId}`;
  const id = props?.params?.RenderingIdentifier;
  const mediaUrlPattern = new RegExp(/mediaurl=\"([^"]*)\"/, 'i');
  const backgroundImage = props?.params?.BackgroundImage;
  let backgroundStyle = {};

  if (backgroundImage && backgroundImage.match(mediaUrlPattern)) {
    const mediaUrl = backgroundImage.match(mediaUrlPattern)?.[1] || '';

    backgroundStyle = {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }

  return (
    <div className={`component container-default ${styles}`} id={id ? id : undefined}>
      <div className="component-content" style={backgroundStyle}>
        <div className="row">
          <Placeholder name={phKey} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};

export const Default = (props) => {
  const splitStyles = props.params?.Styles?.split(' ');

  if (splitStyles && splitStyles.includes('container')) {
    return (
      <div className="container-wrapper">
        <DefaultContainer {...props} />
      </div>
    );
  }

  return <DefaultContainer {...props} />;
};

export default Default;
