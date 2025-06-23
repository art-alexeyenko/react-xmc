import React from 'react';
import { useState } from 'react';
import { Link, Text, useSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const getNavigationText = function (props) {
  let text;

  if (props.fields.NavigationTitle) {
    text = <Text field={props.fields.NavigationTitle} />;
  } else if (props.fields.Title) {
    text = <Text field={props.fields.Title} />;
  } else {
    text = props.fields.DisplayName;
  }

  return text;
};

const getLinkField = (props) => ({
  value: {
    href: props.fields.Href,
    title: getLinkTitle(props),
    querystring: props.fields.Querystring,
  },
});

export const Default = (props) => {
  const [isOpenMenu, openMenu] = useState(false);
  const { sitecoreContext } = useSitecoreContext();
  const styles =
    props.params !== null
      ? `${props.params.GridParameters ?? ''} ${props?.params?.Styles ?? ''}`.trimEnd()
      : '';
  const id = props.params != null ? props.params.RenderingIdentifier : null;

  if (!Object.values(props.fields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id ? id : undefined}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event, flag) => {
    if (event && sitecoreContext?.pageEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      return openMenu(flag);
    }

    openMenu(!isOpenMenu);
  };

  const list = Object.values(props.fields)
    .filter((element) => element)
    .map((element, key) => (
      <NavigationList
        key={`${key}${element.Id}`}
        fields={element}
        handleClick={(event) => handleToggleMenu(event, false)}
        relativeLevel={1}
      />
    ));

  return (
    <div className={`component navigation ${styles}`} id={id ? id : undefined}>
      <label className="menu-mobile-navigate-wrapper">
        <input
          type="checkbox"
          className="menu-mobile-navigate"
          checked={isOpenMenu}
          onChange={() => handleToggleMenu()}
        />
        <div className="menu-humburger" />
        <div className="component-content">
          <nav>
            <ul className="clearfix">{list}</ul>
          </nav>
        </div>
      </label>
    </div>
  );
};

const NavigationList = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const [active, setActive] = useState(false);
  const classNameList = `${props?.fields?.Styles.concat('rel-level' + props.relativeLevel).join(
    ' '
  )}`;

  let children = [];
  if (props.fields.Children && props.fields.Children.length) {
    children = props.fields.Children.map((element, index) => (
      <NavigationList
        key={`${index}${element.Id}`}
        fields={element}
        handleClick={props.handleClick}
        relativeLevel={props.relativeLevel + 1}
      />
    ));
  }

  return (
    <li className={`${classNameList} ${active ? 'active' : ''}`} key={props.fields.Id} tabIndex={0}>
      <div
        className={`navigation-title ${children.length ? 'child' : ''}`}
        onClick={() => setActive(() => !active)}
      >
        <Link
          field={getLinkField(props)}
          editable={sitecoreContext.pageEditing}
          onClick={props.handleClick}
        >
          {getNavigationText(props)}
        </Link>
      </div>
      {children.length > 0 ? <ul className="clearfix">{children}</ul> : null}
    </li>
  );
};

const getLinkTitle = (props) => {
  let title;
  if (props.fields.NavigationTitle?.value) {
    title = props.fields.NavigationTitle.value.toString();
  } else if (props.fields.Title?.value) {
    title = props.fields.Title.value.toString();
  } else {
    title = props.fields.DisplayName;
  }

  return title;
};

export default Default;
