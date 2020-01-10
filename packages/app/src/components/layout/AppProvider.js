import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CommonProvider, ErrorUnexpected, Loading } from 'common';
import { Sidebar } from './Sidebar';

const AppComponent = props => {
  if (props.errors.size > 0) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      sidebar: <Sidebar />,
      main: (
        <section>
          <h1>Welcome</h1>
          <p>Main content will go here</p>
        </section>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.app.loading,
  errors: state.app.errors,
  kapp: state.app.kapp,
  pathname: state.router.location.pathname,
});

export const App = connect(mapStateToProps)(AppComponent);

export class AppProvider extends Component {
  render() {
    return (
      <CommonProvider>
        <App render={this.props.render} />
      </CommonProvider>
    );
  }
}
