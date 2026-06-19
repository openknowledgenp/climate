import { Octokit } from '@octokit/core'

const octokit = new Octokit(process.env.NEXT_PUBLIC_PAT ? { auth: process.env.NEXT_PUBLIC_PAT } : {})


export async function getDatasetsPaths() {
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

    return {
        paths: paths, //create pages at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


export async function getJournalsPaths() {
    async function getFetchPaths() {
        const categories_name: any = []
        const response = await octokit.request(`GET /repos/okfnepal/climatedata/contents/Journals`)
        response.data.map((item: any) => {
            if (item.type === 'dir') {
                categories_name.push(octokit.request(`GET /repos/okfnepal/climatedata/contents/Journals/${item.name}?ref=master`))
            }
        })
        return categories_name
    }

    const datasetPaths = await getFetchPaths()

    const paths = await Promise.all(datasetPaths).then((response) => {
        const staticPaths: any = []
        response.map((item: any) => {
            // staticPaths.push({ params: { data: item, category: item.data[0].path.split('/')[1] } })
            item.data.map((items: any) => {
                staticPaths.push({ params: { dataset: `${items.name}`, category: items.path.split('/')[1] } })
            })
            if (item.data.length > 1) {
            }
        })
        return staticPaths
    }).then((data: any) => {
        return data
    })

    return {
        paths: paths, //create pages at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export async function getJournalsPathsByCategory() {
    async function getFetchPaths() {
        const categories_name: any = []
        const response = await octokit.request(`GET /repos/okfnepal/climatedata/contents/Journals`)
        response.data.map((item: any) => {
            if (item.type === 'dir') {
                categories_name.push(octokit.request(`GET /repos/okfnepal/climatedata/contents/Journals/${item.name}?ref=master`))
            }
        })
        return categories_name
    }

    const datasetPaths = await getFetchPaths()

    const paths = await Promise.all(datasetPaths).then((response) => {
        const staticPaths: any = []
        response.map((item: any) => {
            // staticPaths.push({ params: { category: item.data[0].path.split('/')[1] } })
            item.data.map((items: any) => {
                staticPaths.push({ params: { dataset: `${items.name}`, category: items.path.split('/')[1] } })
            })
            // if (item.data.length > 1) {
            // }
        })
        return staticPaths
    }).then((data: any) => {
        return data
    })

    const datasets = await Promise.all(datasetPaths).then((response) => {
        const journalResources: any = []
        response.map((item: any) => {
            journalResources.push({ params: { category: item.data[0].path.split('/')[1], data: item } })
        })
        return journalResources
    }).then((data): any => {
        return data
    })

    return {
        paths: paths, //create pages at build time
        data: datasets,
        fallback: 'blocking' //indicates the type of fallback
    }
}

