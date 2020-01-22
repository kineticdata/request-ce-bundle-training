# Kinetic Bundle Training - Step 5

### Description

By this step, the services package has routing added to it to allow you to navigate around various pages, such as to a form page.

In this step, we will load a Kinetic form using the `CoreForm` component from the `@kineticdata/react` library. We will also set up more routes to allow us to view a submission, which will also use the `CoreForm` component, but will use a `submissionId` instead of `formSlug` to load the content.

We have included some files within the package that create a simple page that shows you your submissions so that we'll be able to return to them.

- src
  - components
    - Requests.js
      Page that will show submissions for the current user.
  - redux
    - modules
      - submissions.js
        Module for interacting with redux state pertaining to submissions.
    - sagas
      - submissions.js
        Saga for fetching submissions data.

We added a "My Requests" link to the sidebar that will take you to the new page which will list all of your submissions. If you already have submissions in the list, the links to them will not work because we'll be setting up those routes in one of the below exercises.

---

##### The below exercises will guide you through using the `CoreForm` component to load Kinetic forms into the bundle.

In your space, you will need to have a services kapp with some forms defined and added to categories.

**_The changes in all of the below exercises will be to files inside the services package._**

---

### Exercise 1

**Add the `CoreForm` component to the `Form` component to load the Kinetic form.**

**_The changes in this exercise will be to the `src/components/Form.js` file._**

1.  Import the `CoreForm` component from the `@kineticdata/react` library. Also import the `globals` file from common and store it in a variable. The `globals` file contains dependencies that will be asynchronously loaded by `CoreForm` prior to the Kinetic form being loaded. This allows us to load libraries that are only used inside the Kinetic forms without having them add to the initial load time of the bundle.

```javascript
import { CoreForm } from '@kineticdata/react';

const globals = import('common/globals');
```

2.  Add the current `kappSlug` to the props from the `app` state via `mapStateToProps`.

```javascript
const mapStateToProps = (state, props) => ({
  ...
  kappSlug: state.app.kapp.slug,
});
```

3.  Replace the placeholder text with the `CoreForm` component, passing to it the `kappSlug`, `formSlug`, and `globals`.

```javascript
<CoreForm kapp={props.kappSlug} form={props.formSlug} globals={globals} />
```

You can now navigate to a form and will see the form load. You can fill out the form and click submit to create a submission. Currently, you will just see a blank screen after you click submit, because we haven't told the `CoreForm` component to do anything once the form is submitted.

### Exercise 2

**Add a callback to the `CoreForm` component to tell it to redirect when the form is submitted.**

**_The changes in this exercise will be to the `src/components/Form.js` file._**

1.  Add `location` from the `app` state to the props via `mapStateToProps`. Since the `Form` component can be loaded at multiple routes, we'll need to use an absolute path in the redirect to the "My Requests" page, and we'll need the `location` value to build the absolute path.

```javascript
const mapStateToProps = (state, props) => ({
  ...
  location: state.app.location,
});
```

2.  Create a `handleCompleted` callback function that will redirect the user to the "My Requests" page when the form is submitted. We'll use the `navigate` function to redirect, which is a prop provided by `@reach/router` to every component used as a route. The path passed to redirect will be absolute because `props.location` starts with a `/`.

```javascript
export const handleCompleted = props => () => {
  props.navigate(`${props.location}/requests`);
};
```

3.  Connect the `handleCompleted` callback function to props using the `withHandlers` higher-order component (HOC) from `recompose`. You will need to use the `compose` function to use this HOC along with the `connect` HOC already being used.

```javascript
import { compose, withHandlers } from 'recompose';

export const Form = compose(
  connect(mapStateToProps),
  withHandlers({ handleCompleted }),
)(FormComponent);
```

4.  Pass the callback to the `CoreForm` component.

```javascript
<CoreForm
  ...
  completed={props.handleCompleted}
/>
```

Now if you submit a form, you will be redirected to the "My Requests" page.

### Exercise 3

**Add routes to be able to access submitted and draft submissions. Update the `Form` component to also load a submission using `CoreForm` if a `submissionId` exists.**

1.  In `src/AppProvider.js`, add routes to the `Form` component that use a `submissionId` parameter instead of a `formSlug`. We'll create 2 routes based on the existing `Form` routes so that we can relatively redirect to that page if a form has multiple pages. We'll also create 2 more routes to view submissions from the "My Requests" page. These routes will be different so that we can create the correct breadcrumbs for each instance.

```javascript
<Form path="forms/:formSlug/:submissionId" />
<Form path="categories/:categorySlug/forms/:formSlug/:submissionId" />
<Form path="requests/:submissionId" />
<Form path="requests/:submissionId/review" review={true} />
```

2.  In `src/components/Form.js`, update the use of `CoreForm` to be conditional based on whether `submissionId` is provided or not. We will also pass along the `review` prop, which will be set to true when the path to view a request ends in `/review`.

```javascript
{
  props.submissionId ? (
    <CoreForm
      submission={props.submissionId}
      globals={globals}
      completed={props.handleCompleted}
      review={props.review}
    />
  ) : (
    <CoreForm
      kapp={props.kappSlug}
      form={props.formSlug}
      globals={globals}
      completed={props.handleCompleted}
    />
  );
}
```

You can now click the links in the "My Requests" page and they will load the submission. If the submission has a `coreState` of "Draft", the submission will be loaded normally. Otherwise, it will be loaded in review mode.

### Exercise 4

**Add a callback to the `CoreForm` component to tell it to redirect when the submission is created.** This callback will fire when a user saves the form without submitting, or if the form has multiple pages and the first page is submitted. It will also fire at the same time as the `handleCompleted` callback if a single page form is submitted, but we'll include a conditional to prevent multiple redirects.

**_The changes in this exercise will be to the `src/components/Form.js` file._**

1.  Create a `handleCreated` callback function that will redirect the user to one of the routes we added in the last exercise that includes a `submissionId`. Remember to add this handler to the `withHandlers` HOC.

```javascript
export const handleCreated = props => response => {
  if (response.submission.coreState !== 'Submitted') {
    props.navigate(response.submission.id);
  }
};
```

2.  Pass the callback to the `CoreForm` component. You only need to add it to the component that loads a form by its slug (if there's a submission id already then the submission is already created).

```javascript
<CoreForm
  ...
  created={props.handleCreated}
/>
```

Now if you save a form, or submit the first page of a multi page form, you'll see the URL redirect to include the submission id, but the form will still be shown, and will move on to the next page in the case of a multi page form.

### Exercise 5

**Allow for passing of values to the `CoreForm` through the URL.** Kinetic forms can be passed values which will be populated as the defaults into the corresponding fields on load. When we load a Kinetic form via `CoreForm`, we can pass a `values` prop that will then pass along those values to the form.

**_The changes in this exercise will be to the `src/components/Form.js` file._**

1.  Create a helper function that will parse the URL to get a map of values. The expected format for the values is `?values[FieldName]=Value&values[FieldName2]=Value2`. We'll use a `parse` helper function from the `query-string` library which will parse the URL query into key-value pairs. Then we'll check each pair to see if the format matches the expected format for values, and if it does, we'll create an object that maps each field name to its value.

```javascript
import { parse } from 'query-string';

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};
```

2.  Use the above helper function to parse the URL query string. We can get the URL query string from our redux state, as our router is connected to the state and stores the information there.

```javascript
export const mapStateToProps = state => ({
  ...
  values: valuesFromQueryParams(state.router.location.search),
});
```

3.  Pass the values object to the `CoreForm` component. You only need to add it to the component that loads a form by its slug (if there's a submission id already then the submission is already created and cannot set default values anymore).

```javascript
<CoreForm
  ...
  values={props.values}
/>
```

### Exercise 6

**Fix page heading and breadcrumbs for the various `Form` routes.** We currently show the form slug as the heading, but we should be showing the form name. We only get the slug from the route, so we have to fetch the name. Instead of fetching the form record in the `Form` component, we're going to use the `handleLoaded` callback in `CoreForm` to get the name and store it in the component's state.

**_The changes in this exercise will be to the `src/components/Form.js` file._**

1.  Add component state to store the form name using the `withState` HOC from `recompose`. Make sure to import `withState`. make sure to add this before the `withHandlers` HOC as we will be setting this state in the handlers so we need it to exist first.

```javascript
withState('formName', 'setFormName', null);
```

2.  Create a `handleLoaded` callback function that will set the form name into the `Form` component state.

```javascript
export const handleLoaded = props => form => {
  props.setFormName(form.name());
};
```

3.  Pass the callback to the `CoreForm` component. This should be added to the components in both parts of the conditional.

```javascript
<CoreForm
  ...
  loaded={props.handleLoaded}
/>
```

4.  Use the `formName` state value in the page heading.

```javascript
<h1>{props.formName}</h1>
```

5.  Update the breadcrumbs so that they account for all the possible routes. There is a lot of logic here because we are using the same component for many different routes.

```javascript
<h3>
  <Link to={props.location}>services</Link> /{' '}
  {props.categorySlug && (
    <Fragment>
      <Link to={`../..${props.submissionId ? '/..' : ''}`}>
        {props.category ? props.category.name : props.categorySlug}
      </Link>{' '}
      /{' '}
    </Fragment>
  )}
  {!props.formSlug && (
    <Fragment>
      <Link to={`..${props.review ? '/..' : ''}`}>My Requests</Link> /{' '}
    </Fragment>
  )}
</h3>
```

The breadcrumbs should now be accurate regardless of which route you use, and if you visit the form from the "My Requests" page, you will see a breadcrumb that goes back to "My Requests".

---

##### We have now updated the services package to load Kinetic forms by using the `CoreForm` component from the `@kineticdata/react` library. We also added some callbacks to the `CoreForm` component that allow us to redirect or get details about the form on load. In the next step, we'll discuss adding translations to our package.

Please proceed to Step 6. The code in the `step/6` branch has all of the above exercises completed.
