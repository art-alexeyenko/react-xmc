import React from 'react';
import { Link as JssLink, Text } from '@sitecore-jss/sitecore-jss-react';

const LinkListItem = (props) => {
  let className = `item${props.index}`;
  className += (props.index + 1) % 2 == 0 ? ' even' : ' odd';
  if (props.index == 0) {
    className += ' first';
  }
  if (props.index + 1 == props.total) {
    className += ' last';
  }
  return (
    <li className={className}>
      <div className="field-link">
        <JssLink field={props.field} />
      </div>
    </li>
  );
};

export const Default = (props) => {
  const datasource = props.fields?.data?.datasource;
  const styles = `component link-list ${props?.params?.styles}`.trimEnd();
  const id = props.params.RenderingIdentifier;

  if (datasource) {
    const list = datasource.children.results
      .filter((element) => element?.field?.link)
      .map((element, key) => (
        <LinkListItem
          index={key}
          key={`${key}${element.field.link}`}
          total={datasource.children.results.length}
          field={element.field.link}
        />
      ));

    return (
      <div className={styles} id={id ? id : undefined}>
        <div className="component-content">
          <Text tag="h3" field={datasource?.field?.title} />
          <ul>{list}</ul>
        </div>
      </div>
    );
  }

  return (
    <div className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};

export default Default;
