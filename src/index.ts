interface Window {
  PineconeRouter: any;
  NProgress: any;
}

htmx.logAll();

const startProgress = () => window.NProgress.start();
const endProgress = () => window.NProgress.done();

// alpine config
document.addEventListener("alpine:init", () => {
  window.PineconeRouter.settings.hash = false; // use hash routing
  window.PineconeRouter.settings.basePath = "/"; // set the base for the URL, doesn't work with hash routing
  window.PineconeRouter.settings.templateTargetId = "app"; // Set an optional ID for where the internal & external templates will render by default.
  window.PineconeRouter.settings.interceptLinks = true; // Set to false to disable global handling of links by the router, see Disable link handling globally for more.
});
document.addEventListener("pinecone-start", ({ target }: any) => {
  startProgress();
  if (window.PineconeRouter.context.path === target.location.pathname) {
    endProgress();
  }
});
document.addEventListener("pinecone-end", () => {
  endProgress();
  htmx.process(document.documentElement);
});
document.addEventListener("fetch-error", (err) => console.error(err));
// enable swapping into the catastrophicError element when
// response codes are 5xx
// document.addEventListener("htmx:beforeSwap", ({ detail }: any) => {
//   console.log("hm");
//   if (detail.xhr.status === 500 && detail.target.id === "catastrophicError") {
//     console.log("hmmmmmm");
//     detail.shouldSwap = true;
//     detail.isError = true;
//   }
// });
// document.addEventListener("htmx:afterSwap", ({ detail }: any) => {
//   console.log("htmx afterSettle");
//   htmx.process(document.documentElement);
// });

// Helper function to get cookies
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  }
  return null;
}

const isExpired = () =>
  new Date(<number>new Number(getCookie(LOCALSTORAGE_AUTH_KEY) || "0")) <
  new Date();

const router = () => ({
  authHandler(context: any) {
    // check values
    const onAuthPage = ["/login", "/register"].includes(context.path);

    // Check if auth flag or expiry exist, otherwise redirect
    if (isExpired() && !onAuthPage) {
      context.redirect("/login");
      return "stop";
    }

    // redirect to admin homepage if user is already authed and goes to login or registration
    if (!isExpired() && onAuthPage) {
      context.redirect("/admin");
    }
  },
});
