import { reducer as app } from './modules/app';
import categoriesReducer from './modules/categories';
import submissionsReducer from './modules/submissions';

export default {
  app,
  categories: categoriesReducer,
  submissions: submissionsReducer,
};
