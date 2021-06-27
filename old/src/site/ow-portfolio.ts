import { html, LitElement, TemplateResult } from "lit-element";

export class OwPortfolio extends LitElement {

  protected render(): TemplateResult | void {
    return html`<article>
    <section>

        <h2>What customers say about On Words...</h2>
        <blockquote>Allison has a lot of creative ideas for crafting my presentations and helps me by enhancing my
                    English.
            <footer>Marina Reidi, <a href="http://eqpower.ch/">EQ Power</a></footer>
        </blockquote>
        <blockquote>We are very happy with Allison's work. We especially like her thorough approach and her
                    attention to the details. She puts a lot of care to make sure "dass der Satz wirklich genau das sagt,
                    was wir mitteilen wollen".
            <footer>Franco Faga, <a href="http://www.bellingua.ch/">Bellingua</a></footer>
        </blockquote>
        <blockquote>Allison is thorough and meticulous in her work.
            <footer>Sonia Paget, <a href="http://www.englishediting.ch/">English Editing Experts</a></footer>
        </blockquote>
        <blockquote>I really appreciate that Allison looks for the meaning in my work as well as editing the style.
            <footer>Florian Hehlen, writer</footer>
        </blockquote>

    </section>
</article>
    `;
  }
}

customElements.define('ow-portfolio', OwPortfolio);
