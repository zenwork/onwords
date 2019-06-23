import { html, LitElement, TemplateResult } from "lit-element";

export class OwHome extends LitElement {

  protected render(): TemplateResult | void {
    return html`<p>
    for your professional writing, proofreading, editing & communication needs
</p>
<article>

    <section>
        <div></div>
        <div>
            <h3>On Message</h3>
            <ul>
                <li>Commercial</li>
                <li>Academic</li>
                <li>Personal</li>
            </ul>
        </div>
        <div>
            <div>
                <p>You know what you want to express. I make sure that message gets across to your readers,
                   clients, and customers.</p>
                <p>Whether English is your first, second, or sixth language, you know the importance of choosing
                   the
                   right words to say what you mean. As an experienced EFL teacher and Toastmaster, English
                   editor,
                   and voracious reader, I can find those right words. </p>
                <p>On Words is a one-woman team, offering you the personal service you and your message
                   deserve.</p>
            </div>
        </div>
    </section>
    <section>
        <div></div>
        <div>
            <h3>On Track</h3>
            <ul>
                <li>Marketing material</li>
                <li>CVs and cover letters</li>
                <li>Academic papers</li>
            </ul>
        </div>
        <div>
            <div>
                <p>Are you launching your business? Are you applying for your dream job? Are you submitting your
                   PhD thesis or applying for a grant? You know you've got what it takes to succeed &mdash;
                   don't let grammar or spelling mistakes lessen your chances.</p>
            </div>
        </div>
        <div></div>
    </section>
    <section>
        <div></div>
        <div>
            <h3>On Screen</h3>
            <ul>
                <li>presentations</li>
                <li>advertising</li>
            </ul>
        </div>
        <div>
            <div>
                <p>On Words can help you wherever words matter to your audience &mdash; whether it is to copy-edit the English
                   version of your web site, improve the PowerPoint slides for your next presentation, or make sure your
                   marketing slogans are not lost in translation. No job is too small because every word counts.</p>
            </div>
        </div>
        <div></div>
    </section>
    <section>
        <div></div>
        <div>
            <h3>On Paper</h3>
            <ul>
                <li>Articles</li>
                <li>Novels</li>
                <li>Short Stories</li>
            </ul>
        </div>
        <div>
            <div>
                <p>On Words combines over 10 years
                   of experience in editing and proofreading with an immense passion for the English language and a
                   keen understanding of all things literary. </p>
            </div>
        </div>
    </section>
</article>
    `;
  }
}

customElements.define('ow-home', OwHome);
