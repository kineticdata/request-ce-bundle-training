# Kinetic Bundle Training - Step 4

### Description

By this step, the services package is fetching data on load to display the categories. Data is fetched using `redux-saga` and stored in a `redux` store.

In this step, we will add routing to the services package and add links between a few different pages.

We have included some files within the package that we will be linking to. The `fetchCategories` call has also been moved from the `Catalog.js` file to the `AppProvider.js` file as the categories list will be used on multiple pages. Fetching it once when the services `App` loads will allow us to not have to refetch the list for each component that uses it.

- `src`
  - `components`
    - `Category.js`  
      Page that will show the forms that belong to a specific category.
    - `Form.js`  
      Page that will load a specific form (loading of the form will be added in the next step).

We use the library `@reach/router` in our packages to allow for relative links within the package. The `AppProvider` is passed a location from the app package which we will set as the first route path that will load the `App` component of the services package. All nested routes within the package will be relative to this path. This allows us to import the services package and load it at any path, and still have all of its internal links work correctly.

_Although we do use `@reach/router`, we use a forked version of it that has been modified to fix some issues that we ran into. `@reach/router` is no longer being updated, and is having it's functionality implementd within `react-router`, but there is no estimated date of when `react-router` will support relative links._

---

##### The below exercises will guide you through hooking up routing in the services `AppProvider` and adding links within the package to navigate around.

In your space, you will need to have a services kapp with some forms defined and added to categories.

**_The changes in all of the below exercises will be to files inside the services package._**

---

### Exercise 1

**Update the `AppProvider` to add routing functionality.**

**_The changes in this exercise will be to the `src/AppProvider.js` file._**

1.  Wrap the `App` component with a `LocationProvider`. You will need to import the `LocationProvider`, and also the `connectedHistory` object from the `redux/store.js` file.

```javascript
import { LocationProvider } from '@reach/router';
import { connectedHistory } from './redux/store';

<LocationProvider hashRouting history={connectedHistory}>
  <App render={this.props.render} />
</LocationProvider>;
```

2.  Wrap the `App` component with a `Router` and set its path to the location provided by the app package. The `Router` component treats its children as route components, rendering the one whose path matches the url. Adding `/*` will match all child urls.

```javascript
import { Router } from '@reach/router';

<Router>
  <App render={this.props.render} path={`${this.props.appState.location}/*`} />
</Router>;
```

---

### Exercise 2

**Update `AppComponent` to add a `Router` to the main content.** This is where we will define all of our top level routes within the package.

**_The changes in this exercise will be to the `src/AppProvider.js` file._**

1.  Wrap the contents of the `main` tag with a `Router` and set `Catalog` as the default route.

```javascript
<main className="package-layout package-layout--services">
  <Router>
    <Catalog default />
  </Router>
</main>
```

2.  Add a route to the `Category` component defined in `src/components/Category.js`. This route will expect that a category slug is part of the url, so we will use a route variable in the path. The variable `categorySlug` will be available as a prop inside the `Category` component when it's loaded by this route. We make the path relative by not adding a `/` to the beginning of the path.

```javascript
import { Category } from './components/Category';

<Category path="categories/:categorySlug" />;
```

3.  Add routes to the `Form` component defined in `src/components/Form.js`. We'll allow users to access a form through a category or directly, so we'll need 2 paths. This is achieved by including the component in the router twice, each time with a different path.

```javascript
import { Form } from './components/Form';

<Form path="forms/:formSlug" />
<Form path="categories/:categorySlug/forms/:formSlug" />
```

---

### Exercise 3

**Update `Catalog` to convert the list of categories into cards that link to the category page.**

**_The changes in this exercise will be to the `src/components/Catalog.js` file._**

1.  Replace the list of categories with cards.

```javascript
<div className="cards__wrapper cards__wrapper--thirds">
  {!!props.categories &&
    props.categories.map(category => (
      <div className="card card--category">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        {category.categorizations.length > 0 && (
          <p>{category.categorizations.length} Services</p>
        )}
      </div>
    ))}
</div>
```

2.  Turn the card `div` into a link that will take the user to the `Category` component which we created a route to in exercise 2. We will need to import the `Link` component. `Link` takes a `to` prop, which is the path we want to go to. We will make it relative to our current location by not starting the path with `/`.

```javascript
import { Link } from '@reach/router';

<Link to={`categories/${category.slug}`} className="card card--category">
  // Keep card content the same
</Link>;
```

---

##### We have now updated the services package to include routing, and added links to navigate within the package to various category and form pages. In the next step, we will use the `CoreForm` component to load Kinetic forms into our bundle.

Please proceed to Step 5. The code in the `step/5` branch has all of the above exercises completed.
