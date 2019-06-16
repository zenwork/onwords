import { css, customElement, html, LitElement, TemplateResult } from "lit-element";

@customElement('ow-header')
export class OwHeader extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
    }
    
    #S1 {
        background: cadetblue;
    }
    
    #S2 {
        background: cornflowerblue;
    }
    
    #S3 {
        background: gainsboro;
    }
    
    #S4 {
        background: none;
    }
    .square {
        width: 4rem;
        height: 4rem;
        /*background: #222;*/
        /*color: aliceblue;*/
        border: none;
    }
    
    .gallery {
        /**
         * Lay out the children of this container with
         * flexbox, which is horizontal by default.
         */
        display: flex;
      
        /**
         * Allow the children to wrap to the next "row",
         * instead of trying to squeeze them all into
         * a single row.
         */
        flex-wrap: wrap;
      
        width: 8rem;
        padding: 5px;
    }
    
    .banner {
        /**
         * Lay out the children of this container with
         * flexbox, which is horizontal by default.
         */
        display: flex;
      
        /**
         * Allow the children to wrap to the next "row",
         * instead of trying to squeeze them all into
         * a single row.
         */
        flex-wrap: wrap;
      
        width: 100%;
        padding: 5px;
        border: 1px solid #D7DBDD;
    }

    `;
  }

  protected render(): TemplateResult | void {
    return html`
      <div class="banner">
      <div class="gallery">
      
      <a id="S1" class="square" href="#">h</a>
      <a id="S2" class="square" href="#portfolio">p</a>
      <a id="S3" class="square" href="#blog">b</a>
      <div id="S4" class="square">&nbsp;</div>
      </div>
      <div><h1>Onwords</h1></div>
      </div>
    `;
  }
}
