import React, { Fragment } from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from '../redux/store';
import { Link } from '@reach/router';
import { PageTitle } from './shared/PageTitle';
import { CoreForm, I18n } from '@kineticdata/react';
import { parse } from 'query-string';

const globals = import('common/globals');

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

export const handleLoaded = props => form => {
  props.setFormName(form.name());
};

export const handleCreated = props => response => {
  if (response.submission.coreState !== 'Submitted') {
    props.navigate(response.submission.id);
  }
};

export const handleCompleted = props => () => {
  props.navigate(`${props.location}/requests`);
};

const FormComponent = props => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to={props.location}>services</Link> /{' '}
              {props.categorySlug && (
                <Fragment>
                  <Link to={`../..${props.submissionId ? '/..' : ''}`}>
                    {props.category ? props.category.name : props.categorySlug}
                  </Link>{' '}
                  /{' '}
                </Fragment>
              )}
              {!props.formSlug && (
                <Fragment>
                  <Link to={`..${props.review ? '/..' : ''}`}>My Requests</Link>{' '}
                  /{' '}
                </Fragment>
              )}
            </h3>
            <h1>{props.formName}</h1>
          </div>
        </div>
        <I18n context={`kapps.${props.kappSlug}.forms.${props.formSlug}`}>
          {props.submissionId ? (
            <CoreForm
              submission={props.submissionId}
              globals={globals}
              completed={props.handleCompleted}
              review={props.review}
              loaded={props.handleLoaded}
            />
          ) : (
            <CoreForm
              kapp={props.kappSlug}
              form={props.formSlug}
              globals={globals}
              completed={props.handleCompleted}
              created={props.handleCreated}
              loaded={props.handleLoaded}
              values={props.values}
            />
          )}
        </I18n>
      </div>
    </div>
  </Fragment>
);

const mapStateToProps = (state, props) => ({
  kappSlug: state.app.kapp.slug,
  category: state.categories.data.find(
    category => category.slug === props.categorySlug,
  ),
  location: state.app.location,
  values: valuesFromQueryParams(state.router.location.search),
});

export const Form = compose(
  connect(mapStateToProps),
  withState('formName', 'setFormName', null),
  withHandlers({ handleLoaded, handleCreated, handleCompleted }),
)(FormComponent);
