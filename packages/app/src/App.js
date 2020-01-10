import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import './assets/styles/master.scss';
import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { actions } from './redux/modules/app';
import { actions as layoutActions } from './redux/modules/layout';
import { Header } from './components/layout/Header';
import { AppProvider } from './components/layout/AppProvider';

export const AppComponent = props =>
  !props.loading && (
    <AppProvider
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
  lifecycle({
    componentDidMount() {
      this.props.fetchApp(true);
    },
  }),
)(AppComponent);
