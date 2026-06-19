import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import ResourcesNav from '../../../components/ResourceNav'
import { Octokit } from '@octokit/core'




const octokit = new Octokit(process.env.NEXT_PUBLIC_PAT ? { auth: process.env.NEXT_PUBLIC_PAT } : {})
export async function getStaticProps() {
    const named = ['Temperature']
    const res = await octokit.request(`GET /repos/okfnepal/climatedata/contents/Datasets/${named}?ref=master`)
    return {
        props: {
            data: res,
        },
    }
}



const Resources: NextPage = (props: any) => {
    const [data, setData] = useState(props.data.data)
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
                        <h3 className='py-2 mb-2 text-xl' >Data Topics</h3>
                        {/* {props.query[0].params.dataset} */}

                        {/* TODO: Manual Now need to change it */}
                        <div className='pr-8'>
                            <div className='border-2 border-slate-500 bg-gray-100 p-2 mb-2 '>
                                <h2 className='font-neutral text-sm'>Temperature <span className='text-xs font-light'>({data.length})</span></h2>
                                <Link href=''><a target='_blank' className='text-xs font-light'>Explore </a></Link>
                            </div>
                        </div>

                    </div>
                    <div className='w-full mt-8'>
                        <h3 className='py-2 mx-20 mb-4 text-xl'>{data.length} Total Datasets Found</h3>
                        <div className='max-w-2xl mx-20 mb-6'>
                            <input type="text" placeholder='Search for the dataset by name' className=' mb-4 w-10/12 h-8 ring-2 ring-slate-600 focus:ring-outset focus:ring-red-300 p-4 outline-0' />
                            <button className='bg-slate-300 border-slate-800 border-2 p-1 px-6 ml-2 font-medium text-slate-700'>Search</button>
                        </div>
                        <div className=''>
                            {/* {pageArr[pageNum].map((item: any, key: any) => { */}
                            {data.map((item: any, key: any) => {
                                return (
                                    <div className='border-2 border-slate-600 bg-white max-w-2xl py-4 mx-20 mb-4 pl-4 ' key={key}>
                                        <Link href={{
                                            pathname: `/resource/data/[category]/[dataset]`,
                                            query: { dataset: item.name, category: item.path.split('/')[1] },
                                        }}><a className='text-lg px-2 font-bold'> {item.name.split('-').join(' ')}</a></Link>
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
