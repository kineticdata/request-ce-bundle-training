import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { CommonProvider, ErrorUnexpected, Loading } from 'common';
import { context, store } from './redux/store';
import { Sidebar } from './components/Sidebar';
import { Catalog } from './components/Catalog';

const AppComponent = props => {
  return props.render({
    sidebar: <Sidebar />,
    main: <Catalog />,
  });
};

const mapStateToProps = (state, props) => ({
  pathname: state.router.location.pathname,
});

export const App = connect(mapStateToProps)(AppComponent);

export class AppProvider extends Component {
  render() {
    return (
      <Provider store={store} context={context}>
        <CommonProvider>
          <App render={this.props.render} />
        </CommonProvider>{' '}
      </Provider>
    );
  }
}
