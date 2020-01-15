import { reducer as app } from './modules/app';
import categoriesReducer from './modules/categories';

export default {
  app,
  categories: categoriesReducer,
};
