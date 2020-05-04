import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { PageTitle } from './shared/PageTitle';
import { connect } from '../redux/store';
import { I18n } from '@kineticdata/react';

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
                  <I18n>Welcome</I18n> {props.profile.displayName}
                </h1>
              </div>
            </div>
          </div>
          <div className="page-panel__body">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h1>
                  <I18n
                    render={translate =>
                      `${translate(props.kapp.name)} <${props.kapp.slug}>`
                    }
                  />
                </h1>
              </div>
            </div>
            <div className="cards__wrapper cards__wrapper--thirds">
              {!!props.categories &&
                props.categories.map(category => (
                  <Link
                    to={`categories/${category.slug}`}
                    className="card card--category"
                    key={category.slug}
                  >
                    <h1>{category.name}</h1>
                    <p>{category.description}</p>
                    {category.categorizations.length > 0 && (
                      <p>{category.categorizations.length} Services</p>
                    )}
                  </Link>
                ))}
            </div>
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
