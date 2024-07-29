# olea-cms

portfolio/blog CMS

## development

Nix flakes are used to ensure the app is developed in a uniform environment with consistent dependencies regardless of what kind of machine it's being developed on. To start the development environment:

```bash
$ nix develop
```

Start the backend and frontend dev servers in separate terminals/processes.

Backend:

```bash
$ bun dev
```

Frontend:

```bash
$ bun dev
```

For development, the backend will be served at 3030 and the frontend will be served at 5173. A production release strategy is still being worked on. See the READMEs in the `/backend` and `/frontend` directories for more detailed information about development for each component.

### bun

Although this project is Typescript based, it is not using Node.js, deno, or tsc. I have opted to use bun - it's a technology I experimented with when it was new and it seems to be maturing. Bun manages packages, workspaces, and can even build and watch certain types of files. For example, the backend dev script runs `bun --watch src/index.ts` when it's invoked. It also benefits from a significat speed up over its competition.

## backend architecture

### feathers

The backend is built with [feathers](https://feathersjs.com/). I chose to go with the express implementation because koa seems potentially unmaintained. Plus with bun, I don't worry about the speed of express as much. If I need it, feathers has a generated client side api at the ready - although I doubt I will need it, due to my choice of [htmx](https://htmx.org/) and [alpine](https://alpinejs.dev) for the frontend. Even though I probably won't need it, it's nice to have in case, and I really like feathers DX regardless.

## frontend architecture

### htmx

Htmx aims to bring hypertext to the modern era, by allowing html elements to interact with a server and receive back stateful html that can be used to update the dom. If any part of the frontend needs to interact with the backend, it will likely happen in htmx.

### alpinejs

Alpinejs is lightweight and somewhat similar to htmx in DX. I chose it for it's lightness and similarity to htmx. It will primarily be used for interactive elements of the frontend that do not require interaction with the backend.
