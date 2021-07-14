import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class OnWords extends LitElement {
  @property({ type: String }) title = 'Onwords';

  // language=css
  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(5px + 2vmin);
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: #003d57;
      color: #b5f2f5;
    }

    main {
      flex-grow: 1;
    }

    h1 {
      font-size: calc(50px + 2vmin);
    }
    .logo > svg {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        <img src="assets/images/allison.jpg" alt="Allison Turner" />
        <p>
          I am a language editor and proofreader driven by precision and polish:
          a textual healer.
        </p>
        <p>
          When I edit, my goal is always to bring out the true meaning of the
          text. I find the most precise words so that you as the writer say
          exactly what you want to say. I use my language skills (German and
          French), English as a Second Language teaching experience, and natural
          empathy to understand what you mean, and write it the way you would
          have wanted to: clearly, correctly, and a pleasure to read.
        </p>
        <p>
          When I proofread, I let my love of perfection guide me. I’m detail
          oriented, and in proofreading the details are everything. I can't
          guarantee perfection, but it's always my aim.
        </p>
        <p>allison.turner@onwords.ch</p>
      </main>
    `;
  }
}
