/// <reference lib="dom" />
import { findByText, fireEvent } from "@testing-library/dom";
import { pug, renderTemplate } from "../../../tests/utils";

// @ts-expect-error
import navbarTemplate from "./navbar.pug?raw";
import Navbar from './navbar';

let template: string;

beforeAll(() => {
  template = renderTemplate(navbarTemplate);
  
  new Navbar();
  // @ts-expect-error
  Alpine.start();
})

beforeEach(() => {
  document.body.innerHTML = template;
  document.body.appendChild(pug`div(x-data='navbar')`);
});

it('htmx test', async () => {
  document.body.innerHTML = '';
  document.body.appendChild(pug`
div
  div(hx-get='/api/data' hx-target='#results' hx-trigger='load' hx-swap="#results")
  #results
  `);

  fireEvent.load(document.querySelector('[hx-get]')!);

  expect(await findByText(document.body, 'Server rendered pug')).toBeInTheDocument();
})

it("renders pug template", async () => {
  expect(await findByText(document.body, "OleaCMS")).toBeInTheDocument();
});

it("renders categories correctly", async () => {
  expect(await findByText(document.body, 'Cooking')).toBeInTheDocument();
  expect(await findByText(document.body, 'Biking')).toBeInTheDocument();
});
