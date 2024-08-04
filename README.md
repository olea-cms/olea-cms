# olea-cms

portfolio/blog CMS

## development

Nix flakes are used to ensure the app is developed in a uniform
environment with consistent dependencies regardless of what kind of
machine it's being developed on. To start the development environment:

```bash
$ nix develop
```

There is no separate backend/frontend server. To get started simply
run:
```bash
$ bun dev
```

For development, the server will use port 3000.

A production release strategy is still being worked on. See the README
in the`/frontend-old` directory for more detailed information about
testing UI.

### bun

Although this project is Typescript based, it is not using Node.js,
deno, or tsc. I have opted to use bun - it's a technology I
experimented with when it was new and it seems to be maturing. Bun
manages packages, workspaces, and can even build and watch certain
types of files. For example, the dev script runs `bun --watch
src/index.ts` when it's invoked. It also benefits from a significat
speed up over its competition.

## backend architecture

### elysia

The backend is built with [elysia](https://elysiajs.com/). If needed,
elysia has a generated client side api at the ready via eden -
although it shouldn't be needed since [htmx](https://htmx.org/) and
[alpine](https://alpinejs.dev) are being used for the frontend. Even
though I probably won't need it, it's nice to have in case, and the DX
is nice.

### drizzle

Drizzle is the ORM of choice, and sqlite is the default database.

## frontend architecture

### htmx

Htmx aims to bring hypertext to the modern era, by allowing html
elements to interact with a server and receive back stateful html that
can be used to update the dom. If any part of the frontend needs to
interact with the backend, it will likely happen in htmx.

### alpinejs

Alpinejs is lightweight and somewhat similar to htmx in DX. I chose it
for it's lightness and similarity to htmx. It will primarily be used
for interactive elements of the frontend that do not require
interaction with the backend.

### pug

Pug is a lightweight and simple templating language that compiles to
html.
