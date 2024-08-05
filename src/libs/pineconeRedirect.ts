export const pcRedirect = (path: string) =>
  `script window.PineconeRouter.context.redirect('${path}')`;
