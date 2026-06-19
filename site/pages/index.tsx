import type { NextPage } from 'next'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Octokit } from 'octokit'
import { useEffect, useRef } from 'react'
import { getJournalsPathsByCategory } from '../lib/github_rest'

const octokit = new Octokit(process.env.NEXT_PUBLIC_PAT ? { auth: process.env.NEXT_PUBLIC_PAT } : {})

export async function getStaticProps() {
  async function getFetchPaths() {
    const categories_name: any = []
    const response = await octokit.request(`GET /repos/okfnepal/climatedata/contents/Datasets`)
    response.data.map((item: any) => {
      if (item.type === 'dir') {
        categories_name.push(octokit.request(`GET /repos/okfnepal/climatedata/contents/Datasets/${item.name}?ref=master`))
      }
    })
    return categories_name
  }

  const datasetPaths = await getFetchPaths()

  const paths = await Promise.all(datasetPaths).then((response) => {
    const staticPaths: any = []
    response.map((item: any) => {
      item.data.map((items: any) => {
        staticPaths.push({ params: { dataset: `${items.name}`, category: items.path.split('/')[1], data: items } })
      })
    })
    return staticPaths
  }).then((data: any) => data)

  const journals = await getJournalsPathsByCategory()

  return {
    props: {
      data: paths,
      journals: journals.data,
    },
  }
}

/* ── Icon set ── */
const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
)
const IconDrop = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
)
const IconSnowflake = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
  </svg>
)
const IconWind = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </svg>
)
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const ICONS = [IconTrendUp, IconDrop, IconSnowflake, IconWind, IconZap, IconGlobe]

/* ── Source portals (Phase 1 research) ── */
const PORTALS = [
  {
    name: 'World Bank Climate Knowledge Portal',
    href: 'https://climateknowledgeportal.worldbank.org/country/nepal',
    desc: 'Historical climatology, CMIP6 projections, and 70+ risk indices. Dedicated Nepal country pages — the strongest single source for Nepal-specific climate variables.',
    tags: ['Nepal pages', 'Projections', 'Open data'],
  },
  {
    name: 'Global Forest Watch',
    href: 'https://www.globalforestwatch.org/dashboards/country/NPL/',
    desc: 'Annual tree cover loss and gain at 30 m resolution, near-real-time deforestation alerts, and forest carbon stock data. Nepal dashboard with downloadable data.',
    tags: ['Nepal dashboard', 'Forest cover', 'API'],
  },
  {
    name: 'Climate TRACE',
    href: 'https://climatetrace.org/data',
    desc: 'Asset-level and country-level GHG emissions across 74+ subsectors — energy, agriculture, transport, waste. Nepal country package downloadable; public API v4.',
    tags: ['Emissions', 'API v4', 'CC0'],
  },
  {
    name: 'Copernicus Climate Data Store',
    href: 'https://cds.climate.copernicus.eu/',
    desc: "ERA5 and ERA5-Land reanalysis from 1940 to present at 9–31 km resolution. Validated against Nepal's Himalayan precipitation patterns. Python API for bulk downloads.",
    tags: ['Reanalysis', 'Python API', '9 km grid'],
  },
  {
    name: 'Our World in Data — Nepal',
    href: 'https://ourworldindata.org/co2/country/nepal',
    desc: 'CO₂ and GHG emissions, energy mix, and per-capita figures for Nepal. All charts downloadable via GitHub under CC-BY — one of the most accessible entry points.',
    tags: ['Nepal profile', 'Emissions', 'CC-BY'],
  },
  {
    name: 'NOAA Climate Data Online',
    href: 'https://www.ncei.noaa.gov/cdo-web/',
    desc: 'Historical weather station records — temperature, precipitation, degree days. Nepal stations queryable via the global GHCN network. REST API with free token.',
    tags: ['Station data', 'REST API', 'Historical'],
  },
  {
    name: 'IPCC Data Distribution Centre',
    href: 'https://www.ipcc-data.org/',
    desc: 'CMIP6 model outputs, climate scenarios, and socioeconomic data linked to all IPCC Assessment Reports. CORDEX South Asia domain covers Nepal at high resolution.',
    tags: ['CMIP6', 'Scenarios', 'South Asia'],
  },
  {
    name: 'NASA GISS Surface Temperature',
    href: 'https://data.giss.nasa.gov/gistemp/',
    desc: 'Global surface temperature anomalies (land + ocean) from 1880 to present at 2°×2° grid resolution. Open downloads in NetCDF, CSV, and Zarr format.',
    tags: ['Temperature', 'Global', 'Historical'],
  },
]

/* ── Topographic canvas drawing ── */
function drawTopo(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height

  ctx.fillStyle = '#f0f7e6'
  ctx.beginPath()
  if ((ctx as any).roundRect) {
    ;(ctx as any).roundRect(0, 0, W, H, 12)
  } else {
    ctx.rect(0, 0, W, H)
  }
  ctx.fill()

  // Cartographic grid
  ctx.save()
  ctx.strokeStyle = 'rgba(99,153,34,0.07)'
  ctx.lineWidth = 0.5
  for (let x = 0; x < W; x += 36) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 36) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }
  ctx.restore()

  // Peaks: [cx, cy, n rings, scaleA, scaleB, rotation]
  const peaks = [
    { cx: W * 0.57, cy: H * 0.37, n: 24, sA: 1.00, sB: 0.60, rot: -0.22 },
    { cx: W * 0.30, cy: H * 0.62, n: 15, sA: 0.68, sB: 0.44, rot:  0.15 },
    { cx: W * 0.76, cy: H * 0.66, n: 10, sA: 0.52, sB: 0.36, rot: -0.05 },
  ]
  peaks.forEach(({ cx, cy, n, sA, sB, rot }) => {
    for (let i = n; i >= 1; i--) {
      const a  = (8 + i * 15) * sA + Math.sin(i * 1.4) * 5
      const b  = (6 + i *  9) * sB + Math.cos(i * 1.1) * 3
      const op = 0.35 * (1 - i / n) + 0.04
      ctx.beginPath()
      ctx.ellipse(
        cx + Math.sin(i * 0.7) * 2.5,
        cy + Math.cos(i * 0.5) * 1.8,
        a, b,
        rot + Math.sin(i * 0.2) * 0.07,
        0, Math.PI * 2
      )
      ctx.strokeStyle = `rgba(39,80,10,${op.toFixed(3)})`
      ctx.lineWidth = i <= 3 ? 1.6 : i <= 7 ? 1.2 : 0.9
      ctx.stroke()
    }
  })

  // Elevation markers
  const marks = [
    { x: W * 0.57, y: H * 0.35, el: '8,849 m', name: 'Everest' },
    { x: W * 0.30, y: H * 0.59, el: '8,167 m', name: 'Dhaulagiri' },
  ]
  marks.forEach(({ x, y, el, name }) => {
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(39,80,10,0.65)'
    ctx.fill()
    ctx.font = 'bold 9px ui-monospace, monospace'
    ctx.fillStyle = 'rgba(39,80,10,0.55)'
    ctx.fillText(el, x + 7, y - 5)
    ctx.font = '9px ui-monospace, monospace'
    ctx.fillStyle = 'rgba(39,80,10,0.38)'
    ctx.fillText(name, x + 7, y + 5)
  })

  // Compass rose
  const rx = W - 34, ry = H - 34
  const arms: [number, number][] = [[0, -10], [0, 10], [10, 0], [-10, 0]]
  const labels = ['N', 'S', 'E', 'W']
  ctx.font = 'bold 8px ui-monospace, monospace'
  ctx.fillStyle = 'rgba(39,80,10,0.3)'
  ctx.strokeStyle = 'rgba(39,80,10,0.2)'
  ctx.lineWidth = 1
  arms.forEach(([dx, dy], i) => {
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + dx, ry + dy); ctx.stroke()
    ctx.fillText(labels[i], rx + dx * 1.55 - 3, ry + dy * 1.55 + 3)
  })

  // Scale bar
  ctx.fillStyle = 'rgba(39,80,10,0.28)'
  ctx.fillRect(20, H - 28, 60, 2)
  ctx.font = '8px ui-monospace, monospace'
  ctx.fillStyle = 'rgba(39,80,10,0.38)'
  ctx.fillText('100 km', 20, H - 14)
}

/* ── Page ── */
const Home: NextPage = (props: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) drawTopo(canvasRef.current)
  }, [])

  return (
    <Layout title="Home">

      {/* HERO */}
      <section className="ckp-hero">
        <div className="ckp-hero-inner">
          <div>
            <p className="ckp-eyebrow">Open Knowledge Nepal &mdash; climate portal</p>
            <h1 className="ckp-hero-hl">
              The Hindu Kush Himalaya<br />
              warms <em>three times faster</em><br />
              than the world average.
            </h1>
            <p className="ckp-hero-sub">
              Nepal&rsquo;s climate data lives in silos &mdash; scattered across government
              reports, research institutions, and locked APIs. This portal aggregates open
              datasets, curated journals, and stakeholder resources so researchers,
              journalists, and policymakers can find and act on the evidence.
            </p>
            <div className="ckp-hero-stats" aria-label="Key statistics">
              <div>
                <span className="ckp-stat-val">3,252</span>
                <span className="ckp-stat-lbl">glaciers in Nepal&rsquo;s watershed</span>
              </div>
              <div>
                <span className="ckp-stat-val">240M+</span>
                <span className="ckp-stat-lbl">people dependent on glacial meltwater</span>
              </div>
              <div>
                <span className="ckp-stat-val">3&times;</span>
                <span className="ckp-stat-lbl">faster warming than global average</span>
              </div>
            </div>
            <div className="ckp-hero-actions">
              <Link href="/resource/data" passHref>
                <a className="ckp-btn ckp-btn-p">Explore datasets</a>
              </Link>
              <Link href="/contribute" passHref>
                <a className="ckp-btn ckp-btn-s">Contribute data</a>
              </Link>
            </div>
          </div>
          <div className="ckp-hero-visual" aria-hidden="true">
            <canvas ref={canvasRef} id="ckp-topo" width={430} height={430} />
          </div>
        </div>
      </section>

      {/* SOURCE PORTALS */}
      <section className="ckp-sec ckp-sec-leaf" id="portals">
        <div className="ckp-wrap">
          <p className="ckp-sec-eye">Open data sources</p>
          <h2 className="ckp-sec-ttl">Where climate data comes from</h2>
          <p className="ckp-sec-lead">
            Authoritative global portals publishing the underlying evidence. Several provide
            Nepal-specific data or South Asia regional coverage &mdash; cross-referenced
            with datasets hosted here.
          </p>
          <div className="ckp-portals">
            {PORTALS.map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="ckp-p-card">
                <div className="ckp-p-hd">
                  <span className="ckp-p-name">{p.name}</span>
                  <span className="ckp-p-arr" aria-hidden="true">&#8599;</span>
                </div>
                <p className="ckp-p-desc">{p.desc}</p>
                <div className="ckp-tags">
                  {p.tags.map((t) => <span key={t} className="ckp-tag">{t}</span>)}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DATASETS */}
      <section className="ckp-sec ckp-sec-white" id="datasets">
        <div className="ckp-wrap">
          <p className="ckp-sec-eye">Open datasets</p>
          <h2 className="ckp-sec-ttl">Climate datasets for Nepal</h2>
          <p className="ckp-sec-lead">
            Curated and contributed datasets hosted on GitHub &mdash; freely downloadable
            and open for reuse.
          </p>
          <p className="ckp-notice" role="note">
            <span aria-hidden="true">&#9888;</span>
            <span>
              Data loads live from{' '}
              <a href="https://github.com/okfnepal/climatedata" target="_blank" rel="noopener noreferrer">
                okfnepal/climatedata
              </a>
              . Adding a GitHub token in <code>.env.local</code> raises the API rate limit from 60 to 5,000 requests/hour.
            </span>
          </p>
          <div className="ckp-data-grid">
            {props.data.map((item: any, i: number) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <div className="ckp-d-card" key={i}>
                  <div className="ckp-d-icon"><Icon /></div>
                  <p className="ckp-d-cat">{item.params.category.split('-').join(' ')}</p>
                  <p className="ckp-d-name">{item.params.dataset.split('-').join(' ')}</p>
                  <div className="ckp-d-acts">
                    <Link href={`/resource/data/${item.params.category}/${item.params.dataset}`} passHref>
                      <a className="ckp-btn ckp-btn-p ckp-btn-sm">Explore</a>
                    </Link>
                    <a
                      href={item.params.data.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ckp-btn ckp-btn-g ckp-btn-sm"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="ckp-sec-foot">
            <Link href="/resource/data" passHref>
              <a className="ckp-btn ckp-btn-s">Browse all datasets</a>
            </Link>
          </div>
        </div>
      </section>

      {/* JOURNALS */}
      <section className="ckp-sec" id="journals">
        <div className="ckp-wrap">
          <p className="ckp-sec-eye">Research library</p>
          <h2 className="ckp-sec-ttl">Climate journals and reports</h2>
          <p className="ckp-sec-lead">
            Curated academic papers, government assessments, and technical reports on
            Nepal&rsquo;s climate future &mdash; organised by theme.
          </p>
          <div className="ckp-j-grid">
            {props.journals.slice(0, 3).map((item: any, i: number) => (
              <div className="ckp-j-card" key={i}>
                <p className="ckp-j-cat">{item.params.category.split('_').join(' ')}</p>
                <p className="ckp-j-name">{item.params.category.split('_').join(' ')}</p>
                <p className="ckp-j-meta">
                  Updated{' '}
                  {item.params.data.headers['last-modified']
                    ?.split(' ').slice(1, 4).join(' ') ?? '—'}
                </p>
                <div className="ckp-j-acts">
                  <Link href={`/resource/journals/${item.params.category}`} passHref>
                    <a className="ckp-btn ckp-btn-p ckp-btn-sm">Explore</a>
                  </Link>
                  <a
                    href={item.params.data.data[0]?.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ckp-btn ckp-btn-g ckp-btn-sm"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="ckp-sec-foot">
            <Link href="/resource/journals" passHref>
              <a className="ckp-btn ckp-btn-s">Browse all journals</a>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTRIBUTE CTA */}
      <section className="ckp-sec ckp-sec-forest" id="contribute">
        <div className="ckp-wrap">
          <div className="ckp-cta-row">
            <div>
              <h2 className="ckp-cta-h">
                Help build Nepal&rsquo;s most complete open climate record
              </h2>
              <p className="ckp-cta-p">
                This is a collaborative, open-source project. Contribute datasets, research
                papers, design, or code &mdash; every addition makes the evidence more
                complete and more accessible.
              </p>
            </div>
            <div className="ckp-cta-btns">
              <a
                href="https://github.com/okfnepal/climatedata"
                target="_blank"
                rel="noopener noreferrer"
                className="ckp-btn ckp-btn-w"
              >
                Contribute on GitHub
              </a>
              <Link href="/contribute" passHref>
                <a className="ckp-btn ckp-btn-wo">How to contribute</a>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  )
}

export default Home
