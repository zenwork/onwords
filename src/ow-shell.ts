import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { Loader } from "./loader";
import { Router } from "./shared/Router";

@customElement('ow-shell')
export class OwShell extends LitElement {

  @property({attribute: true})
  activeView: string;

  router: Router;

  constructor() {
    super();
    console.log('loading...');
    Loader.load.all().then(() => {
      console.log('starting');
      this.router = new Router(
        () => {
          this.activeView = 'home';
          this.requestUpdate();
        }, this)
        .add(
          'portfolio',
          () => {
            this.activeView = 'portfolio';
            this.requestUpdate();
          }
        )
        .debug();


      this.router.goto(window.location.hash);

    });
  }

  protected render(): TemplateResult | void {
    console.log('rendering: ' + this.activeView);

    return html`
        <a @click=${() => this.router.goto('portfolio')} href="#portfolio">portfolio</a>
        <div>
            ${this.selectView(this.activeView)}
        </div>
    `

  }

  private selectView(view: string): TemplateResult {
    if (view === 'portfolio') {
      return html`<ow-portfolio></ow-portfolio>`;
    } else if (view === 'home') {
      return html`<ow-home></ow-home>`;
    }
    return html`not found`
  }


}






