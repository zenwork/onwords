import { html, fixture, expect } from '@open-wc/testing';

import { OnWords } from '../src/OnWords.js';
import '../src/on-words.js';

describe('OnWords', () => {
  let element: OnWords;
  beforeEach(async () => {
    element = await fixture(html`<on-words></on-words>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
