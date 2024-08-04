import "@testing-library/jest-dom";
import { findByText, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { pug, htmxReprocess, renderTemplate } from "../../../tests/utils";

// @ts-expect-error
import navbarTemplate from "./navbar.pug?raw";
import Navbar from "./navbar";
import { mockRouter } from "../../../mocks/router";

let template: string = renderTemplate(navbarTemplate);

beforeAll(() => {
  const nav = new Navbar();
  // @ts-expect-error
  Alpine.start();
});

describe("general environment", async () => {
  it("htmx test", async () => {
    document.body.innerHTML = "";
    document.body.appendChild(pug`
div
  #el(hx-get='/api/data' hx-target='#results' hx-trigger='load' hx-swap="#results")
  #results`);

    fireEvent.click(document.querySelector("[hx-get]")!);
    //     htmx.trigger("#el", "click");
    expect(await findByText(document.body, "Server rendered pug")).toBeTruthy();
  });

  it("alpine test", async () => {
    document.body.innerHTML = "";
    document.body.appendChild(pug`
.m-auto(x-data='{ count: 0 }')
  .mt-4.text-center
    span.text-error.text-3xl(x-text='count')
    .flex.justify-between.mt-4
      button.btn.btn-primary(x-on:click='count--') Decrement
      button.btn.btn-secondary(x-on:click='count++') Increment`);

    fireEvent.click(await findByText(document.body, "Increment"));
    expect(await findByText(document.body, "1")).toBeTruthy();
    fireEvent.click(await findByText(document.body, "Increment"));
    expect(await findByText(document.body, "2")).toBeTruthy();

    fireEvent.click(await findByText(document.body, "Decrement"));
    expect(await findByText(document.body, "1")).toBeTruthy();
    fireEvent.click(await findByText(document.body, "Decrement"));
    expect(await findByText(document.body, "0")).toBeTruthy();
  });
});

describe("navbar", async () => {
  let navbar: Navbar;

  beforeEach(() => {
    document.body.innerHTML = template;
    console.log({ mockRouter: mockRouter() });
    const router = mockRouter();
    // mock router data in outer div, render component in inner div
    document.body.appendChild(pug`
div(x-data="${router}")
  div(x-data='navbar')
    `);
  });

  it("renders title", async () => {
    expect(await findByText(document.body, "OleaCMS Test")).toBeTruthy();
  });

  it("fetches categories on dropdown click", async () => {
    htmxReprocess();
    //     htmx.trigger("[data-testid='blog-dropdown']", "click");
    userEvent.click(document.querySelector("#blogDropdown")!);
    // (window as any).htmx.trigger("#blogDropdown", "click");
    expect(await findByText(document.body, "Cooking")).toBeTruthy();
    expect(await findByText(document.body, "Biking")).toBeTruthy();
  });
});
