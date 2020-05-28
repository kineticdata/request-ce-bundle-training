import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { Link } from '@reach/router';
import { PageTitle } from './shared/PageTitle';

const FormComponent = props => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to={`../..${props.categorySlug ? '/../..' : ''}`}>
                services
              </Link>{' '}
              /{' '}
              {props.categorySlug && (
                <Fragment>
                  <Link to="../..">
                    {props.category ? props.category.name : props.categorySlug}
                  </Link>{' '}
                  /{' '}
                </Fragment>
              )}
            </h3>
            <h1>{props.formSlug}</h1>
          </div>
        </div>
        <p>Form needs to be loaded here</p>
      </div>
    </div>
  </Fragment>
);

const mapStateToProps = (state, props) => ({
  category: state.categories.data.find(
    category => category.slug === props.categorySlug,
  ),
});

export const Form = connect(mapStateToProps)(FormComponent);