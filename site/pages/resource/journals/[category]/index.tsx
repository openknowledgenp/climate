import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import ResourcesNav from '../../../../components/ResourceNav'
import { getJournalsPathsByCategory } from '../../../../lib/github_rest'

export async function getStaticPaths() {
    const journalPaths = await getJournalsPathsByCategory()
    // Deduplicate to one path per category
    const seen = new Set<string>()
    const paths = journalPaths.paths.filter((p: any) => {
        if (seen.has(p.params.category)) return false
        seen.add(p.params.category)
        return true
    }).map((p: any) => ({ params: { category: p.params.category } }))
    return { paths, fallback: false }
}

export async function getStaticProps({ params }: any) {
    const journalPaths = await getJournalsPathsByCategory()
    const catData = journalPaths.data.find((d: any) => d.params.category === params.category)
    return {
        props: {
            data: catData ? { data: catData.params.data.data } : { data: [] },
            query: params,
        },
    }
}



const Resources: NextPage = (props: any) => {
    const [data, setData] = useState(props.data)
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
                <div className='flex space-x-10 '>
                    <div className='mt-8  w-60'>
                        <h3 className='py-2 mb-2 text-xl' >Journal Topic</h3>
                        {/* {props.query[0].params.dataset} */}

                        {/* TODO: Manual Now need to change it */}
                        <div className='pr-8'>
                            <h2 className='font-neutral text-sm'>{props.query.category}</h2>
                        </div>

                    </div>
                    <div className='w-full mt-8'>
                        <h3 className='py-2 mx-20 mb-4 text-xl'>{data.data.length} Resources Found</h3>
                        <div className=''>
                            {/* {pageArr[pageNum].map((item: any, key: any) => { */}
                            {data.data.map((item: any, key: any) => {
                                return (
                                    <div className='border-2 border-slate-600 bg-gray-200 max-w-2xl py-4 mx-20 mb-4 pl-4 ' key={key}>
                                        <Link href={{
                                            pathname: `/resource/data/[category]/[dataset]`,
                                            query: { dataset: item.name, category: item.path.split('/')[1] },
                                        }}><a className='text-lg px-2 font-bold'> {item.name.split('_').join(' ')}</a></Link>
                                        <div className='flex p-2 space-x-10'>
                                            <Link href={item.html_url}><a target='_blank' className='text-xs font-light'>View in Github</a></Link>
                                            <Link href={{
                                                pathname: `/resource/data/[category]/[dataset]`,
                                                query: { dataset: item.name, category: item.path.split('/')[1] },
                                            }}><a target='_blank' className='text-xs font-light'>View Details</a></Link>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className='flex mx-20 max-w-2xl'>
                                <div className=' flex mx-auto'>

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
            <div >

            </div>
        </Layout >
    )
}

export default Resources
