# olea-cms frontend

OleaCMS frontend

## environment

Set up your environment by copying `.env.json.template` to `.env.json` and updating `.env.json`.

## development

Run:

```bash
$ bun dev
```

## testing

The test environment uses vitest, jsdom, pug, texsaur, with a custom setup. To execute the tests run:

```bash
$ bun run test
```

### environment

The test environment sets up jsdom, jest-dom, jsx, htmx, and imports Alpine and the `AlpineComponent` class. When writing tests, jsdom emulates a browser environment and you can functionally imagine you are writing code in a browser. You can interact with the dom by using the functions provided in `@testing-library/dom`. There are 2 utilities that help you set up a unit test in its `beforeAll` hook provided in `tests/utils.ts`: the `pug` tagged template literal function and the `renderTemplate` function. The general pattern to follow is to import the pug template as a raw string, render it, and reset the dom before each test with the initial render string returned by `renderTemplate`:

```typescript
import { findByTestId } from "@testing-library/dom";
import { pug, renderTemplate } from "../../../tests/utils";

// The ?raw is from vite but it throws off typescript
// @ts-expect-error
import componentTemplate from "./component.pug?raw";
import Component from "./component";

let template: string;

beforeAll(() => {
  template = renderTemplate(componentTemplate);

  new Component();
  // We define on the window object in vitest.setup.ts, but we don't have types for it globally in this file
  // @ts-expect-error
  Alpine.start();
});

beforeEach(() => {
  document.body.innerHTML = template;
  document.body.appendChild(pug`div(x-data='component')`);
});

it("renders the component", async () => {
  expect(
    await findByTestId(document.body, "component-test-id"),
  ).toBeInTheDocument();
});
```
