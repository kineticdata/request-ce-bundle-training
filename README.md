# Kinetic Bundle Training - Step 6

### Description

By this step, the services package has routing, data fetching, and loads Kinetic forms.

In this step, we will add translation support to the package. We will use the `I18n` component from the `@kineticdata/react` library to wrap content inside our package to allow it to be translated.

Translation functionality consists of 2 parts. First, the bundle needs to wrap its text content appropriately to allow translations. Second, translation data needs to exist that maps the wrapped context to its translated values.

The first part we will go over in the below exercises. For the second part, we have included the code for the settings package in this bundle which contains the consoles for adding translation data. In the exercise prologue, we'll briefly go over how to use the console to add translation data.

We've also updated the `packages/app/src/App.js` file to import and use the `AppProvider` from the settings package when the route matches `/settings` (this static location value is defined within the settings package), and added a "Settings" link to the header dropdown menu.

---

##### The below exercises will guide you through using the `I18n` component to wrap text so that it can be translated.

**_The changes in all of the below exercises will be to files inside the services package._**

---

### Exercise Prologue

In order for content to be translated, we need to create translation data to map the content to its translated values. We do this inside the Translations console within Settings (you can access this by clicking on "Settings" in the header menu and then clicking "Translations").

You will first need to define locales into which you would like the content translated. English should already be listed there. We'll skip this step for now and just create English translations.

Below the locales table, you will see translations contexts. A translation context is a grouping of related translation data. The **shared** context is the default context and where the majority of the translation data will exist. However, we also have contexts for each form as well as the ability to create custom contexts. We'll focus on the shared context for this exercise.

If you click on the "Shared Translations" link, you will see a table with keys and translations. This is where we will define some translation data so that we can wrap some text in the services package and see it translated in the below exercises. Please add the following values to the table.

| Locale | Key      | Translation |
| ------ | -------- | ----------- |
| en     | Welcome  | Hello       |
| en     | Services | Requests    |
| en     | Submit   | Submit >>   |

Now we need to return to the main Translations console screen, and we will see a message stating that "there are new translations waiting to be published". Click that message and the click the "Publish" button in the top right corner of the page. When we add new translation entries, they don't immediately go live. They first need to be published to be used in the bundle.

Now we are ready to start translating content in our services package.

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
