import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { Octokit } from '@octokit/core'
import { useRouter } from 'next/router'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import Layout from '../../../../components/Layout'
import { getDatasetsPaths } from '../../../../lib/github_rest'
import ResourcesNav from '../../../../components/ResourceNav'

const octokit = new Octokit(process.env.NEXT_PUBLIC_PAT ? { auth: process.env.NEXT_PUBLIC_PAT } : {})

export async function getStaticPaths() {
  const stuffs = await getDatasetsPaths()
  return {
    paths: stuffs.paths,
    fallback: stuffs.fallback
  }
}

export async function getStaticProps({ params }: any) {
  const res = await octokit.request(`GET /repos/okfnepal/climatedata/contents/Datasets/${params.category}/${params.dataset}?ref=master`)

  return {
    props: {
      data: res,
      query: params
    },
  }
}

const Res: NextPage = (props: any) => {
  const router = useRouter()
  const [data, setData] = useState(props.data.data)
  const re = /(?:\.([^.]+))?$/
  const dataLen = data.length
  const datal = Number(dataLen / 10)
  const pageArr = []
  const [pageNum, setPageNum] = useState(0)
  for (let i = 0; i < Number(datal.toFixed()); i++) {
    pageArr.push(data.slice(i * 10, (i + 1) * 10))
  }

  return (
    <Layout title='Resources'>
      <div className='max-w-7xl mx-auto px-8 my-10'>
        <ResourcesNav />

        <div className='w-full'>
          <Breadcrumbs
            containerStyle={{ display: 'flex', justifyContent: 'space-between' }}
            listStyle={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', listStyle: 'none', padding: '0' }}
            inactiveItemStyle={{ color: '#282a35', cursor: 'default', marginRight: '8px' }}
            activeItemStyle={{ color: '#282a35', textDecoration: 'underline' }}
            transformLabel={(label: any) => {
              if (router.asPath.split('/').slice(-1).some(item => item === label)) {
                return label.split("-").join(' ')
              } else {
                return label + ' >'
              }
            }}
            replaceCharacterList={[{ from: '%20', to: '&gt;' }]}
            rootLabel="Home"
          />
          <div className='mt-16  max-w-3xl'>
            <h3 className='py-2 mb-4 text-3xl'>{props.query.dataset.split('-').join(' ')}</h3>
            <div className=''>
              <div className='grid grid-cols-4  max-w-4xl'>
                <div className='col-span-3 my-2 text-lg mb-2'>Data Files </div>
                {data.map((item: any, key: any) => {
                  return (
                    <div className={`max-w-2xl col-span-4 grid grid-cols-5 py-3 px-4 ${key % 2 === 0 ? 'bg-zinc-300' : `bg-zinc-200`}`} key={key}>
                      <div className='col-span-4 text-sm'>{item.name}</div>
                      <div>
                        <Link href={item._links.html} passHref>
                          <a target='_blank' className='text-sm mr-4 text-slate-800'>Github</a>
                        </Link>
                        |
                        <Link href={item._links.self} passHref>
                          <a target='_blank' className='text-sm ml-4 text-slate-800'>View</a>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='flex mx-20 max-w-2xl'></div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </Layout>
  )
}

export default Res
