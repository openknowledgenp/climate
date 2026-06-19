import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import ResourcesNav from '../../../components/ResourceNav'
import { Octokit } from '@octokit/core'
import { getJournalsPathsByCategory } from '../../../lib/github_rest'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { useRouter } from 'next/router'

const octokit = new Octokit(process.env.NEXT_PUBLIC_PAT ? { auth: process.env.NEXT_PUBLIC_PAT } : {})

export async function getStaticProps() {
    const journalPaths = await getJournalsPathsByCategory()
    return {
        props: {
            data2: journalPaths.paths,
            data: journalPaths.data
        },
    }
}

const Resources: NextPage = (props: any) => {
    const [data, setData] = useState(props.data2)
    const counts = props.data2.reduce((c: any, { params: key }: any) => (c[key.category] = (c[key.category] || 0) + 1, c), {})
    const dataLen = data.length
    const datal = Number(dataLen / 10)
    const pageArr = []
    const router = useRouter()
    const [pageNum, setPageNum] = useState(0)
    for (let i = 0; i < Number(datal.toFixed()); i++) {
        pageArr.push(data.slice(i * 10, (i + 1) * 10))
    }
    return (
        <Layout title='Journals'>
            <div className='max-w-7xl mx-auto px-8 my-10 text-slate-800'>
                <ResourcesNav />
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
                <div className='flex'>
                    <div className='mt-8'>
                        <h3 className='py-2 mb-2 text-xl'>Journal Topics</h3>
                        <div className=''>
                            {props.data.map((item: any, key: any) => {
                                return (
                                    <div className='border-slate-600 border-2 bg-gray-200 w-36 p-2 mb-2' key={key}>
                                        <p className='font-neutral text-sm'>{item.params.category.split('_').join(' ')} <span className='text-xs font-light'>({counts[item.params.category]})</span></p>
                                        <Link href={`/resource/journals/${item.params.category}`} passHref>
                                            <a className='text-xs font-light'>Explore</a>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='w-full mt-8'>
                        <h3 className='py-2 mx-20 mb-4 text-xl'>{data.length} Resources found</h3>
                        <div className=''>
                            {props.data.map((item: any, key: any) => {
                                return (
                                    <div key={key}>
                                        {item.params.data.data.map((items: any, key: any) => {
                                            return (
                                                <div className='border-2 border-slate-600 bg-white max-w-2xl py-4 mx-20 mb-4 pl-4' key={key}>
                                                    <Link href={items.html_url} passHref>
                                                        <a className='text-lg px-2 font-bold' target='_blank'>{items.name.split('-').join(' ')}</a>
                                                    </Link>
                                                    <div className='flex p-2 space-x-10'>
                                                        <Link href={items.html_url}>
                                                            <a target='_blank' className='text-xs font-light'>View in Github</a>
                                                        </Link>
                                                        <Link href={items.download_url}>
                                                            <a target='_blank' className='text-xs font-light'>Download</a>
                                                        </Link>
                                                        <p className='text-xs font-light'>last modified: {item.params.data.headers['last-modified']}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                            <div className='flex mx-20 max-w-2xl'>
                                <div className='flex mx-auto'>
                                    {pageArr.map((item: any, key: any) => {
                                        return (
                                            <button className='mx-1 border-2 px-2' key={key} onClick={() => setPageNum(key)}>
                                                {key + 1}
                                            </button>
                                        )
                                    })}
                                    <button className='mx-1 border-2 px-2' onClick={() => console.log('increment function')}>
                                        next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
        </Layout>
    )
}

export default Resources
