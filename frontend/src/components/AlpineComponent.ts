//
const getAllMethods = (obj: any) => {
  let props: string[] = [];

  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map((s) => s.toString()))
      .sort()
      .filter(
        (p, i, arr) =>
          typeof obj[p] === "function" && //only the methods
          p !== "constructor" && //not the constructor
          (i == 0 || p !== arr[i - 1]) && //not overriding in this prototype
          props.indexOf(p) === -1, //not overridden in a child
      );
    props = props.concat(l);
  } while (
    (obj = Object.getPrototypeOf(obj)) && //walk-up the prototype chain
    Object.getPrototypeOf(obj) //not the the Object prototype methods (hasOwnProperty, etc...)
  );

  return props;
};

export default class AlpineComponent {
  /**
   * Utility class for creating components of sorts with alpinejs.
   *
   * @param dataTag - The data tag that alpine will use for this component (<div x-data="dataTag"/>)
   * @param templateId - The id of the template that has the markup for the component
   *
   * @beta
   */
  constructor(dataTag: string, templateId: string) {
    document.addEventListener("alpine:init", () => {
      (window as any).Alpine.data(dataTag, () => ({
        displayText: "",
        init() {
          this.displayText = (this as any).$el.innerHTML;
          (this as any).$el.innerHTML =
            document.getElementById(templateId)?.innerHTML;
        },
        ...getAllMethods(this).reduce(
          (methods, method) => ({
            ...methods,
            [method]: (this as any)[method],
          }),
          {},
        ),
      }));
    });
  }
}

export { AlpineComponent };
