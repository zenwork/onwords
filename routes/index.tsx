import {asset, Head}              from '$fresh/runtime.ts'
import {HandlerContext, Handlers} from '$fresh/server.ts'
import {logUser}                  from './axiomLogger.ts'

const denoDeployUrl = /https:\/\/(www\.)?onwords\.ch(\/|\/index.html)?/
const oneHour = 3_600_000
export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    logUser(_req)
    const resp = await ctx.render()
    resp.headers.set('Cache-Control', `max-age=${oneHour}}`)
    return resp
  },
}

export default function Home(request: Request) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="favicon/site.webmanifest"/>

        <meta content="On Words" name="title"/>
        <meta
          content="English editing services including copy-editing, proofreading, etc."
          name="description"
        />
        <meta
          content="editing, copy, proofreading, line, wordsmith, presentation, advertising, marketing, CV, academic, paper, commercial"
          name="keywords"
        />
        {denoDeployUrl.test(request.url.href)
         ? <meta content="index, follow" name="robots"/>
         : <meta content="noindex, nofollow" name="robots"/>}
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="8 days" name="revisit-after"/>
        <meta content="English" name="description"/>

        <title>On Words</title>

        <link rel="stylesheet" type="text/css" href={asset('./base.css')}/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant&family=Courier+Prime&family=Yanone+Kaffeesatz&display=swap"
          rel="stylesheet"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta
          name="description"
          content="On Words: english editing services provided by Allison Turner, textual healer."
        />
      </Head>
      <article id="main">
        <section class="above-fold--container">
          <h1 class="above-fold--1">On Words</h1>
          <img
            class="above-fold--2"
            src="img/allison.jpg"
            alt="portrait of Allison Turner"
          />
          <h3 class="above-fold--3">
            I am a language editor and proofreader dedicated to precision and polish: a textual healer.
          </h3>
          <p class="above-fold--4 header-text--sm-viewport">
            allison.turner@onwords.ch
          </p>
        </section>
        <section style="border:none">
          <p>
            When I edit, my goal is always to bring out the true meaning of the text. I find the most precise words so that you
            as the
            writer say exactly what you want to say. I use my language skills (German and French), English as a Second Language
            teaching
            experience, and natural empathy to understand what you mean, and write it the way you would have wanted to: clearly,
            correctly,
            and a pleasure to read.
          </p>
          <p>
            When I proofread, I let my love of perfection guide me. I’m detail oriented, and in proofreading the details are
            everything. I
            can't guarantee perfection, but it's always my aim.
          </p>
        </section>
        <section>
          <h2>On Message</h2>
          <ul>
            <li>Commercial</li>
            <li>Academic</li>
            <li>Personal</li>
          </ul>
          <p>
            You know what you want to express. I make sure that message gets across to your readers, clients, and customers.
          </p>
          <p>
            Whether English is your first, second, or sixth language, you know the importance of choosing the right words to say
            what you
            mean. As an experienced EFL teacher and Toastmaster, English editor, and voracious reader, I can find those right
            words.
          </p>
          <p>
            On Words is a one-woman team, offering you the personal service you and your message deserve.
          </p>
        </section>
        <section>
          <h2>On Track</h2>
          <ul>
            <li>Marketing material</li>
            <li>CVs and cover letters</li>
            <li>Academic papers</li>
          </ul>
          <p>
            Are you launching your business? Are you applying for your dream job? Are you submitting your PhD thesis or applying
            for a
            grant? You know you've got what it takes to succeed &mdash;don't let grammar or spelling mistakes lessen your
            chances.
          </p>
        </section>
        <section>
          <h2>On Screen</h2>
          <ul>
            <li>presentations</li>
            <li>advertising</li>
          </ul>
          <p>
            On Words can help you wherever words matter to your audience &mdash; whether it is to copy-edit the English version
            of your web
            site, improve the PowerPoint slides for your next presentation, or make sure your marketing slogans are not lost in
            translation.
            No job is too small because every word counts.
          </p>
        </section>
        <section>
          <h2>On Words is...</h2>
          <p>...Allison Turner</p>
          <ul>
            <li>an editor</li>
            <li>a proofreader</li>
            <li>
              a member of the{' '}
              <a href="https://www.ciep.uk/directory/allison-turner">
                Chartered Institute of Editing and Proofreading
              </a>
            </li>
            <li>a wordsmith</li>
            <li>and a textual healer</li>
          </ul>
        </section>
        <section>
          <h2>Find me</h2>
          <ul>
            <li>
              <a href="https://www.facebook.com/allison.turner.5011">
                on facebook
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/allison-turner-textual-healer/">
                on linkedIn
              </a>
            </li>
            <li>
              on mail ({' '}
              <a href="mailto:allison.turner@onwords.ch">
                allison.turner@onwords.ch
              </a>)
            </li>
          </ul>
          <svg width="100%" height="10%" class="footer">
            <text x="0ex" y="90%" class="inlay">on Words</text>
          </svg>
        </section>
        <p class="copyright">
          &#169;2014-23 On Words, Switzerland. All rights reserved.
        </p>
      </article>
    </>
  )
}
