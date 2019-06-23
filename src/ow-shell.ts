import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { classMap } from 'lit-html/directives/class-map.js';
import { Loader } from "./loader";
import { Router } from "./shared/Router";

@customElement('ow-shell')
export class OwShell extends LitElement {

  @property({attribute: true})
  activeView: string;

  router: Router;
  private finishedLoading = false;

  constructor() {
    super();
    console.log('loading...');

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
      .add(
        'blog',
        () => {
          this.activeView = 'blog';
          this.requestUpdate();
        }
      )
    // .debug()
    ;

    Loader.load
      .initial(['OwHeader'])
      .then(() => {
        console.log('starting');
        this.router.goto(window.location.hash);

      })
      .then(() => Loader.load.all().then(() => {
        this.finishedLoading = true;
        this.requestUpdate()
      }))
    ;
  }

  static get styles() {
    // language=CSS
    return css`
        ow-home, ow-portfolio, ow-blog {
            width: 95%;
            height: 600px;
            border: red solid 1px;
        }

        elix-sliding-pages {
            width: 100%;
        }

        .hidden {
            display: none;
        }
    `
  }

  protected render(): TemplateResult | void {
    console.log('rendering: ' + this.activeView);
    let classes = {hidden: !this.finishedLoading};
    let beforeClases = {hidden: this.finishedLoading};

    return html`

        <ow-header></ow-header>
        <div class=${classMap(beforeClases)}>...Ordering the words...</div>
        <elix-sliding-pages
            class=${classMap(classes)}
            selected-index="${(this.getIndex(this.activeView))}">
            <ow-home></ow-home>
            <ow-portfolio></ow-portfolio>
            <ow-blog></ow-blog>
        </elix-sliding-pages>
    `

  }


  private getIndex(view: string) {
    switch (view) {
      case 'portfolio':
        return 1;
      case 'blog':
        return 3;
      default:
        return 0;
    }
  }
}






