import React, { Fragment } from 'react';
import { PageTitle } from './shared/PageTitle';

export const Catalog = () => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container page-container--color-bar">
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h1>Services Package</h1>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
