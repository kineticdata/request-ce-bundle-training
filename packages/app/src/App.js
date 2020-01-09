import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import './assets/styles/master.scss';
import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { actions } from './redux/modules/app';

export const AppComponent = props =>
  !props.loading && (
    <section className="container d-flex flex-column">
      <h1>{`Welcome ${props.profile.displayName ||
        props.profile.username}`}</h1>
      <hr />
      <div className="mx-3">
        <h4>{`Space: ${props.space.name}`}</h4>
        <div className="mx-3">
          <h5>Kapps</h5>
          <ul>
            {props.kapps.map(kapp => (
              <li key={kapp.slug}>
                <Link to={`/kapps/${kapp.slug}`}>{kapp.name}</Link>
              </li>
            ))}
          </ul>
          {props.kapp && (
            <div>
              <h5>
                {`Current Kapp: ${props.kapp.name}`}{' '}
                <Link to="/" className="btn btn-link text-danger">
                  <span className="fa fa-times fa-fw" />
                </Link>
              </h5>
            </div>
          )}
        </div>
      </div>
    </section>
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
  kapps: state.app.kapps,
  kapp: state.app.kapp,
  profile: state.app.profile,
  space: state.app.space,
});

export const mapDispatchToProps = {
  fetchApp: actions.fetchApp,
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
