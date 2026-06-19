import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  containerStyle?: React.CSSProperties
  listStyle?: React.CSSProperties
  inactiveItemStyle?: React.CSSProperties
  activeItemStyle?: React.CSSProperties
  transformLabel?: (label: string) => string
  replaceCharacterList?: { from: string; to: string }[]
  rootLabel?: string
}

const Breadcrumbs: React.FC<Props> = ({
  containerStyle,
  listStyle,
  inactiveItemStyle,
  activeItemStyle,
  transformLabel,
  replaceCharacterList,
  rootLabel = 'Home'
}) => {
  const router = useRouter()
  const asPath = router.asPath || '/'
  // Remove query and hash
  const cleanPath = asPath.split('?')[0].split('#')[0]
  const segments = cleanPath.split('/').filter(Boolean)

  const applyReplacements = (label: string) => {
    let out = label
    if (replaceCharacterList && Array.isArray(replaceCharacterList)) {
      replaceCharacterList.forEach(r => {
        out = out.split(r.from).join(r.to)
      })
    }
    if (transformLabel) return transformLabel(out)
    return out
  }

  const items = [{ href: '/', label: rootLabel }, ...segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    return { href, label: seg }
  })]

  return (
    <nav style={containerStyle} aria-label="Breadcrumb">
      <ol style={listStyle}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          const label = applyReplacements(item.label)
          const style = isLast ? activeItemStyle : inactiveItemStyle
          return (
            <li key={item.href} style={{ display: 'inline', marginRight: 8 }}>
              {isLast ? (
                <span style={style as React.CSSProperties}>{label}</span>
              ) : (
                <>
                  <Link href={item.href} legacyBehavior>
                    <a style={style as React.CSSProperties}>{label}</a>
                  </Link>
                  <span style={{ margin: '0 8px' }}>{'>'}</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
