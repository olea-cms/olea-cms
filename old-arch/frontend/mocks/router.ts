export type MockRouter = `{$router: {path: '${string}'}}`;

export const mockRouter = (
  { path } = {
    path: "/",
  },
) => `{$router: {path: '${path}'}}`;
