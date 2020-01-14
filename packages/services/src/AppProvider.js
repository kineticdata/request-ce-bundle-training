import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { CommonProvider, ErrorUnexpected, Loading } from 'common';
import { connect, context, store } from './redux/store';
import { Sidebar } from './components/Sidebar';
import { Catalog } from './components/Catalog';
import { syncAppState } from './redux/modules/app';
import { is } from 'immutable';

const AppComponent = props => {
  return props.render({
    sidebar: <Sidebar />,
    main: (
      <main className="package-layout package-layout--services">
        <Catalog />
      </main>
    ),
  });
};

const mapStateToProps = (state, props) => ({});

export const App = connect(mapStateToProps)(AppComponent);

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
            <App render={this.props.render} />
          </CommonProvider>
        </Provider>
      )
    );
  }
}
