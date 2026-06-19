import Head from 'next/head'
import Link from 'next/link'
import Nav from './Nav'

export default function Layout({ children, title = 'Home' }: any) {
  return (
    <>
      <Head>
        <title>{title ? `${title} — Climate Knowledge Portal Nepal` : 'Climate Knowledge Portal Nepal'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Open climate data and research for Nepal — centralising datasets, journals, and resources on climate change." />
      </Head>

      <Nav />
      <main>{children}</main>

      <footer className="ckp-footer">
        <div className="ckp-footer-row">
          <div>
            <p className="ckp-footer-brand">Open Knowledge Nepal</p>
            <p className="ckp-footer-tag">&ldquo;Liberating knowledge for opportunity&rdquo;</p>
          </div>
          <ul className="ckp-footer-links">
            <li>
              <a href="https://oknp.org/" target="_blank" rel="noopener noreferrer">
                oknp.org
              </a>
            </li>
            <li>
              <a href="https://github.com/okfnepal/climatedata" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <Link href="/contribute"><a>Contribute</a></Link>
            </li>
          </ul>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            Nepal climate data &mdash; open and accessible
          </p>
        </div>
      </footer>
    </>
  )
}
