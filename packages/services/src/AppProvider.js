import React, { Component } from 'react';
import { compose, lifecycle } from 'recompose';
import { Provider } from 'react-redux';
import { LocationProvider, Router } from '@reach/router';
import { CommonProvider, ErrorUnexpected, Loading } from 'common';
import { connectedHistory, connect, context, store } from './redux/store';
import { Sidebar } from './components/Sidebar';
import { Catalog } from './components/Catalog';
import { Category } from './components/Category';
import { Form } from './components/Form';
import { syncAppState } from './redux/modules/app';
import { actions } from './redux/modules/categories';
import { is } from 'immutable';
import axios from 'axios';

const AppComponent = props => {
  if (!!props.categoriesError) {
    return <ErrorUnexpected />;
  } else if (!props.categories) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      sidebar: <Sidebar />,
      main: (
        <main className="package-layout package-layout--services">
          <Router>
            <Catalog default />
            <Category path="categories/:categorySlug" />
            <Form path="forms/:formSlug" />
            <Form path="categories/:categorySlug/forms/:formSlug" />
          </Router>
        </main>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  categories: state.categories.data,
  categoriesError: state.categories.error,
});

const mapDispatchToProps = {
  fetchCategories: actions.fetchCategoriesRequest,
};

export const App = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchCategories();
    },
  }),
)(AppComponent);

export class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
    // Listen to the local store to see if the embedded app is ready to be
    // re-rendered. Currently this just means that the required props have been
    // synced into the local store.
    this.unsubscribe = store.subscribe(() => {
      const ready = store.getState().app.ready;
      if (ready !== this.state.ready) {
        this.setState({ ready });
      }
    });
  }

  componentDidMount() {
    Object.entries(this.props.appState).forEach(syncAppState);
  }

  componentDidUpdate(prevProps) {
    Object.entries(this.props.appState)
      .filter(([key, value]) => !is(value, prevProps.appState[key]))
      .forEach(syncAppState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      this.state.ready && (
        <Provider store={store} context={context}>
          <CommonProvider>
            <LocationProvider hashRouting history={connectedHistory}>
              <Router>
                <App
                  render={this.props.render}
                  path={`${this.props.appState.location}/*`}
                />
              </Router>
            </LocationProvider>
          </CommonProvider>
        </Provider>
      )
    );
  }
}
