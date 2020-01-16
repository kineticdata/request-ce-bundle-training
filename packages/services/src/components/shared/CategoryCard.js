import React from 'react';
import { Link } from '@reach/router';
import { Icon } from 'common';

export const CategoryCard = props => (
  <Link to={props.path} className="card card--category">
    <h1>
      <Icon image={props.category.icon} background="blueSlate" />
      {props.category.name}
    </h1>
    <p>{props.category.description}</p>
    {props.countOfMatchingForms > 0 && (
      <p>{props.countOfMatchingForms} Services</p>
    )}
  </Link>
);
