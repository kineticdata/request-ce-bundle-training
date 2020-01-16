import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { Link } from '@reach/router';
import { ServiceCard } from '../shared/ServiceCard';
import { PageTitle } from '../shared/PageTitle';

const CategoryComponent = props => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../..">services</Link> /{' '}
            </h3>
            <h1>{props.category && props.category.name}</h1>
          </div>
        </div>
        {props.category &&
          props.category.categorizations
            .map(categorization => ({
              form: categorization.form,
              path: `forms/${categorization.form.slug}`,
              key: categorization.form.slug,
            }))
            .map(props => <ServiceCard {...props} />)}
      </div>
    </div>
  </Fragment>
);

const mapStateToProps = (state, props) => ({
  category: state.categories.find(
    category => category.slug === props.categorySlug,
  ),
});

export const Category = connect(
  mapStateToProps,
  null,
)(CategoryComponent);
