# Kinetic Bundle Training - Step 6

### Description

By this step, we have completed a number of task.

In this step, we are going to explore some of previous concepts.  We will start by adding a new route.  Using recompose we will dispatch and action.  The action will kick off a redux saga that will fetch records from a datastore.

We will use a helper from the react kinetic lib to assist in fetching the datastore records.  Further building on our understanding 
of datastores using a custom index to fetch specific records from the datastore.

---

##### The below exercises will guide you through using a custom index to fetch specific records from a datastore.

**_The changes in all of the below exercises will be to files inside the services package._**

---

### Exercise 1

**Translate the "Welcome" text in the top banner of the services package home page.**

**_The changes in this exercise will be to the `src/components/Catalog.js` file._**

1.  Import the `I18n` component from the `@kineticdata/react` library.

```javascript
import { I18n } from '@kineticdata/react';
```

2.  Wrap the "Welcome" text with the `I18n` component to tell the bundle to translate that value.

```javascript
<h1 className="text-truncate">
  <I18n>Welcome</I18n> {props.profile.displayName}
</h1>
```

You should now see the word "Hello" instead of the word "Welcome" in the banner at the top of the page.

---

### Exercise 2

**Translate the "Services" kapp name that appears below the top banner.** The kapp name is displayed within a template literal, and we can't use components inside template literals. The `I18n` component can also accept a `render` function as a prop (instead of accepting children content). It will then call this `render` function and provide it with a `translate` function as the first parameter. This allows us to translate parts of strings, or things such as the option values in a select or placeholder values in inputs.

**_The changes in this exercise will be to the `src/components/Catalog.js` file._**

1.  Translate the kapp name using the `render` prop of the `I18n` component.

```javascript
<h1>
  <I18n
    render={translate => `${translate(props.kapp.name)} <${props.kapp.slug}>`}
  />
</h1>
```

---

### Exercise 3

**Load a form translation context.** Each form has its own translation context where we can define translation entries. These contexts are used to group like translations together and to prevent the need to load all translations at once. In order to switch contexts, we can wrap a component or group of code in the `I18n` tag and pass it a `context` prop. This will load the translations for the given context and use them within the wrapped code.

1.  In `src/components/Form.js`, wrap the code that loads the `CoreForm` component with the `I18n` component and pass it the context for the currently loaded form.

```javascript
<I18n context={`kapps.${props.kappSlug}.forms.${props.formSlug}`}>
  // Code to be translated within the form context here
</I18n>
```

We did not define any translation entries for form contexts, so we will not see any form specific translations. However, all form and custom contexts default to the shared context. If you open any form, you should see the Submit button text change to "Submit >>". This is because the value is translate in the shared context. If you translated the Submit key to a different value within a specific form context, it would show that translation instead of the shared one.

Note that some of our routes do not have the `formSlug` in the url and thus the context will be incorrect. To make it work, we'd need to pre-fetch the submission to get the corm slug from it.

While this exercise has you wrap the `CoreForm` component in the form context, this step is not required as `CoreForm` will retrieve its own translations. This step would be necessary if we wanted to translate a value within a form context, but display it outside the `CoreForm` component.

---

### Exercise Epilogue

The `I18n` component is able to translate these values and is aware of which locale to translate them into because the entire bundle is wrapped in a `KineticLib` component. In the `packages/app/src/index.js` file, you can see a `ConnectedKineticLib` component, which passes the current locale to the `KineticLib` component from the `@kineticdata/react` library. The entire `App` component is then wrapped in the `ConnectedKineticLib`.

The `KineticLib` component internally uses an `I18nProvider` component which handles fetching the translation data for the necessary contexts and makes it available for the `I18n` component to access.

---

##### We have now updated the services package to support translations.

You can view the `develop` branch to see and explore the full kinetic bundle. While the concepts shown in these steps are used to build the packages, the exacpt implementation might vary a bit as it was simplified and pared down for these exercises.
