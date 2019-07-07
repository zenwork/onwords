import { html, fixture, expect } from '@open-wc/testing';

import '../src/on-words.js';

describe('<on-words>', () => {
  it('has a default property heading', async () => {
    const el = await fixture('<on-words></on-words>');

    expect(el.heading).to.equal('Hello world!');
  });

  it('allows property heading to be overwritten', async () => {
    const el = await fixture(html`
      <on-words heading="different heading"></on-words>
    `);

    expect(el.heading).to.equal('different heading');
  });
});
