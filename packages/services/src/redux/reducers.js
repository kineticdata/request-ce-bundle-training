import { reducer as app } from './modules/app';
import categoriesReducer from './modules/categories';
import sitesReducer from './modules/sites';
import submissionsReducer from './modules/submissions';

export default {
  app,
  categories: categoriesReducer,
  sites: sitesReducer,
  submissions: submissionsReducer,
};
