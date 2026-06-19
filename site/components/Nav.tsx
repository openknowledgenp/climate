import { Disclosure } from '@headlessui/react'
import Link from 'next/link'

const navigation = [
  { name: 'Home',         href: '/',                 cta: false },
  { name: 'Datasets',     href: '/resource/data',    cta: false },
  { name: 'Journals',     href: '/resource/journals', cta: false },
  { name: 'Playbook',     href: '/playbook',          cta: false },
  { name: 'Stakeholders', href: '/stakeholders',      cta: false },
  { name: 'Contribute',   href: '/contribute',        cta: true  },
]

export default function Nav() {
  return (
    <Disclosure as="nav" className="ckp-nav">
      {({ open }) => (
        <>
          <div className="ckp-nav-inner">
            <Link href="/" passHref>
              <a className="ckp-nav-logo" aria-label="Climate Knowledge Portal home">
                <span className="ckp-nav-mark" aria-hidden="true">CKP</span>
                <span>Climate Knowledge Portal</span>
              </a>
            </Link>

            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-1">
              {navigation.map((item) => (
                <Link href={item.href} key={item.name} passHref>
                  <a className={`ckp-nav-link${item.cta ? ' ckp-nav-link--cta' : ''}`}>
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <div className="sm:hidden">
              <Disclosure.Button className="ckp-nav-toggle" aria-label="Toggle menu">
                {open ? '✕' : '☰'}
              </Disclosure.Button>
            </div>
          </div>

          {/* Mobile panel */}
          <Disclosure.Panel className="sm:hidden ckp-nav-mobile">
            {navigation.map((item) => (
              <Link href={item.href} key={item.name} passHref>
                <a className="ckp-nav-mobile-link">{item.name}</a>
              </Link>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
