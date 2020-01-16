import React, { Fragment } from 'react';
import { PageTitle } from './shared/PageTitle';
import { connect } from '../redux/store';

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
            {!!props.categories &&
              props.categories.map(category => (
                <div key={category.slug}>
                  <h3>{category.name}</h3>
                </div>
              ))}
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
});

export const Catalog = connect(mapStateToProps)(CatalogComponent);
