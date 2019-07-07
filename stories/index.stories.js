import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import OnWords from '../src/OnWords.js';
import '../src/on-words.js';

import readme from '../README.md';

storiesOf('on-words', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(OnWords), { notes: { markdown: readme } })
  .add(
    'Alternative Header',
    () => html`
      <on-words .header=${'Something else'}></on-words>
    `,
  );
