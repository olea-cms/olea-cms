import AlpineComponent from "./AlpineComponent";

export default class RouteComponent extends AlpineComponent {
  constructor(
    dataTag: string,
    templateId: string,
    route: string,
    initialProps?: {},
  ) {
    document.getElementById(templateId)?.setAttribute("x-route", route);
    super(dataTag, templateId, initialProps);
  }
}

export { RouteComponent };
