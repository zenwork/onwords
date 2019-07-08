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
    console.debug('loading...');

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
        console.debug('starting');
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

  private static getIndex(view: string) {
    switch (view) {
      case 'portfolio':
        return 1;
      case 'blog':
        return 3;
      default:
        return 0;
    }
  }


  private switchNav() {
    return (e) => {

      switch (e.detail.selectedIndex) {
        case 0:
          this.router.goto('');
          break;
        case 1:
          this.router.goto('portfolio');
          break;
        case 2:
          this.router.goto('blog');
          break;
      }
    };
  }

  protected render(): TemplateResult | void {
    // console.log('rendering: ' + this.activeView);
    let classes = {hidden: !this.finishedLoading};
    let beforeClases = {hidden: this.finishedLoading};

    // language=html
    return html`
        <ow-header></ow-header>
        <div class=${classMap(beforeClases)}>...Ordering the words...</div>
        <elix-sliding-pages @selected-index-changed=${(this.switchNav())}
            class=${classMap(classes)}
            selected-index="${(OwShell.getIndex(this.activeView))}">
            <ow-home style="overflow: auto"></ow-home>
            <ow-portfolio style="overflow: auto"></ow-portfolio>
            <ow-blog style="overflow: auto"></ow-blog>
        </elix-sliding-pages>
        <ow-footer></ow-footer>
    `

  }
}






