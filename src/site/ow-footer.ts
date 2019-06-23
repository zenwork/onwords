import { LitElement, TemplateResult, html, customElement } from "lit-element";

@customElement('ow-footer')
export class OwFooter extends LitElement {
  protected render(): TemplateResult | void {
    return html`
        <footer >
    <div></div>
    <div>
        <div>

            <h2>On Words is Allison Turner...</h2>
            <h2>...and Allison Turner is</h2>
            <ul>
                <li>an editor</li>
                <li>a proofreader</li>
                <li>a member of the <a href="http://www.sfep.org.uk/">Society for Editors and Proofreaders</a>
                <li>a wordsmith</li>
                <li>and a textual healer</li>
            </ul>
        </div>


    </div>
    <div>
        <h2>Contact Me</h2>
        <h2 >on-facebook</h2>
        <h2 >on-linked-in</h2>
        <h2 >on-mail</h2>
    </div>
    <div >
        <div >
            <div >
                <img src="../../static/img/allison.jpg" class="contact-border">
            </div>
        </div>
        <div>
            <div >
                <h2 >on-slogan</h2>

            </div>
        </div>
    </div>

</footer>
<div >
    <div>&#169;2014-19 On Words, Switzerland. All rights reserved.</div>

</div>
    `;
  }
}
