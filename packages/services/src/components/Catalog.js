import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from './shared/PageTitle';
import { connect } from '../redux/store';
import { actions } from '../redux/modules/categories';

export const CatalogComponent = props => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        <div className="page-panel">
          <div className="page-panel__header">
            <div className="search-services-home">
              <div className="search-services-home__wrapper">
                <h1 className="text-truncate">
                  Welcome {props.profile.displayName}
                </h1>
              </div>
            </div>
          </div>
          <div className="page-panel__body">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h1>{`${props.kapp.name} <${props.kapp.slug}>`}</h1>
              </div>
            </div>
            {!!props.categoriesError ? (
              <div className="alert alert-danger">
                <h4>Error Fetching Categories</h4>
                <p>{props.categoriesError.message}</p>
              </div>
            ) : !!props.categories ? (
              props.categories.map(category => (
                <div>
                  <h3>{category.name}</h3>
                </div>
              ))
            ) : (
              <div>
                <h4 className="text-center">
                  <span className="fa fa-spinner fa-spin" />
                </h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  profile: state.app.profile,
  categories: state.categories.data,
  categoriesError: state.categories.error,
});

const mapDispatchToProps = {
  fetchCategories: actions.fetchCategoriesRequest,
};

export const Catalog = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchCategories();
    },
  }),
)(CatalogComponent);
