import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { CommonProvider, ErrorUnexpected, Loading } from 'common';
import { connect, context, store } from './redux/store';
import { Sidebar } from './components/Sidebar';
import { Catalog } from './components/Catalog';

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
  render() {
    return (
      <Provider store={store} context={context}>
        <CommonProvider>
          <App render={this.props.render} />
        </CommonProvider>
      </Provider>
    );
  }
}
