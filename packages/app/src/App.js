import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import './assets/styles/master.scss';
import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { actions } from './redux/modules/app';
import { actions as layoutActions } from './redux/modules/layout';
import { Header } from './components/layout/Header';
import { AppProvider } from './components/layout/AppProvider';
import { Utils } from 'common';
import ServicesApp from 'services';

// Mapping of Bundle Package kapp attribute values to App Components
const BUNDLE_PACKAGE_PROVIDERS = {
  services: ServicesApp,
};

const getAppProvider = (kapp, pathname) => {
  if (kapp) {
    return (
      BUNDLE_PACKAGE_PROVIDERS[
        Utils.getAttributeValue(kapp, 'Bundle Package', kapp.slug)
      ] || AppProvider
    );
  } else {
    return AppProvider;
  }
};

export const AppComponent = props =>
  !props.loading && (
    <props.AppProvider
      appState={{
        ...props.app.toObject(),
        location: `${props.kapp !== null ? `/kapps/${props.kapp.slug}` : '/'}`,
        actions: {
          refreshApp: props.refreshApp,
        },
      }}
      render={({ main, sidebar }) => (
        <div className="app-wrapper">
          <div className="app-header">
            <Header
              toggleSidebar={() => props.setSidebarOpen(!props.sidebarOpen)}
            />
          </div>
          <div
            className={`app-body ${
              props.sidebarOpen ? 'open-sidebar' : 'closed-sidebar'
            }`}
          >
            <div className="app-sidebar-container">{sidebar}</div>
            <div className="app-main-container">{main}</div>
          </div>
        </div>
      )}
    />
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
  kapps: state.app.kapps,
  kapp: state.app.kapp,
  profile: state.app.profile,
  space: state.app.space,
  sidebarOpen: state.layout.sidebarOpen,
  app: state.app,
});

export const mapDispatchToProps = {
  fetchApp: actions.fetchApp,
  setSidebarOpen: layoutActions.setSidebarOpen,
};

export const App = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    AppProvider: getAppProvider(props.kapp),
  })),
  withHandlers({
    refreshApp: props => () => props.fetchApp(),
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchApp(true);
    },
  }),
)(AppComponent);
