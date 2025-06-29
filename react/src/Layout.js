import React from 'react';
import { Placeholder, VisitorIdentification } from '@sitecore-jss/sitecore-jss-react';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import Helmet from 'react-helmet';

// Using bootstrap is completely optional. It's used here to provide a clean layout for samples,
// without needing extra CSS in the sample app. Remove it in package.json as well if it's removed here.
import 'bootstrap/dist/css/bootstrap.css';
import './assets/app.css';
import './assets/styles/sass/main.scss';
import logo from './assets/sc_logo.svg';

/*
  APP LAYOUT
  This is where the app's HTML structure and root placeholders should be defined.

  All routes share this root layout by default (this could be customized in RouteHandler),
  but components added to inner placeholders are route-specific.
*/

// This is boilerplate navigation for sample purposes. Most apps should throw this away and use their own navigation implementation.
// Most apps may also wish to use GraphQL for their navigation construction; this sample does not simply to support disconnected mode.
let Navigation = ({ t, i18n }) => (
  <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom">
    <h5 className="my-0 me-md-auto fw-normal">
      <NavLink to="/" className="text-dark">
        <img src={logo} alt="Sitecore" />
      </NavLink>
    </h5>
    <nav className="my-2 my-md-0 me-md-3">
      <a
        className="p-2 text-dark"
        href="https://jss.sitecore.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('Documentation')}
      </a>
      <NavLink to="/styleguide" className="p-2 text-dark">
        {t('Styleguide')}
      </NavLink>
      <NavLink to="/graphql" className="p-2 text-dark">
        {t('GraphQL')}
      </NavLink>
    </nav>
  </div>
);

// inject dictionary props (`t`) into navigation so we can translate it
// NOTE: using this is needed instead of using i18next directly to keep
// the component state updated when i18n state (e.g. current language) changes
Navigation = withTranslation()(Navigation);

const Layout = ({ route }) => {
  // const isPageEditing = route.layoutData.sitecore.context.pageEditing;
  // const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode';
  const mainClassPageEditing = 'prod-mode'; // TODO: proper context handling
  return (
    <React.Fragment>
      {/* react-helmet enables setting <head> contents, like title and OG meta tags */}
      <Helmet>
        <title>
          {(route.fields && route.fields.pageTitle && route.fields.pageTitle.value) || 'Page'}
        </title>
      </Helmet>

      {/*
      VisitorIdentification is necessary for Sitecore Analytics to determine if the visitor is a robot.
      If Sitecore XP (with xConnect/xDB) is used, this is required or else analytics will not be collected for the JSS app.
      For XM (CMS-only) apps, this should be removed.

      VI detection only runs once for a given analytics ID, so this is not a recurring operation once cookies are established.
    */}
      <VisitorIdentification />

      <Navigation />

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        <header>
          <div id="header">{route && <Placeholder name="headless-header" rendering={route} />}</div>
        </header>
        <main>
          <div id="content">{route && <Placeholder name="headless-main" rendering={route} />}</div>
        </main>
        <footer>
          <div id="footer">{route && <Placeholder name="headless-footer" rendering={route} />}</div>
        </footer>
      </div>
    </React.Fragment>
  );
};

// We don't want to re-render `Layout` when route is changed but layout data is not loaded
// Layout will be re-rendered only when layout data is changed
const propsAreEqual = (prevProps, nextProps) => {
  if (fastDeepEqual(prevProps.route, nextProps.route)) return true;

  return false;
};

export default React.memo(Layout, propsAreEqual);
