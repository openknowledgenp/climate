import { Octokit } from '@octokit/core'

const REPO = 'okfnepal/climatedata'
const BRANCH = 'master'
const GH = `https://github.com/${REPO}`
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`
const API = `https://api.github.com/repos/${REPO}/contents`

const octokit = new Octokit(process.env.NEXT_PUBLIC_PAT ? { auth: process.env.NEXT_PUBLIC_PAT } : {})

type TreeItem = { path: string; type: string; sha: string; url: string }

// Module-level cache so multiple getStaticPaths calls in the same build worker share one API call
let _tree: TreeItem[] | null = null

async function getRepoTree(): Promise<TreeItem[]> {
  if (_tree) return _tree
  const res = await octokit.request(`GET /repos/${REPO}/git/trees/${BRANCH}?recursive=1`)
  _tree = res.data.tree as TreeItem[]
  return _tree
}

const ghFile = (path: string) => `${GH}/blob/${BRANCH}/${path}`
const ghDir  = (path: string) => `${GH}/tree/${BRANCH}/${path}`
const rawUrl = (path: string) => `${RAW}/${path}`
const apiUrl = (path: string) => `${API}/${path}`

export async function getDatasetsPaths() {
  const tree = await getRepoTree()

  // Dataset directories are at depth 3: Datasets/Category/DatasetName
  const datasetDirs = tree.filter(
    t => t.type === 'tree' && t.path.startsWith('Datasets/') && t.path.split('/').length === 3
  )

  const paths = datasetDirs.map(dir => {
    const [, category, dataset] = dir.path.split('/')

    const files = tree
      .filter(f => f.type === 'blob' && f.path.startsWith(dir.path + '/'))
      .map(f => ({
        name: f.path.split('/').pop() as string,
        path: f.path,
        html_url: ghFile(f.path),
        download_url: rawUrl(f.path),
        _links: { html: ghFile(f.path), self: apiUrl(f.path) },
      }))

    return {
      params: {
        category,
        dataset,
        // data shape expected by homepage and dataset index pages
        data: { html_url: ghDir(dir.path), name: dataset, path: dir.path, type: 'dir' },
        // files consumed by [dataset].tsx getStaticProps to avoid a per-page API call
        files,
      },
    }
  })

  return { paths, fallback: false as const }
}

export async function getJournalsPaths() {
  const tree = await getRepoTree()

  const journalFiles = tree.filter(
    t => t.type === 'blob' && t.path.startsWith('Journals/') && t.path.split('/').length === 3
  )

  const paths = journalFiles.map(f => {
    const parts = f.path.split('/')
    return { params: { dataset: parts[2], category: parts[1] } }
  })

  return { paths, fallback: false as const }
}

export async function getJournalsPathsByCategory() {
  const tree = await getRepoTree()

  const journalCats = tree.filter(
    t => t.type === 'tree' && t.path.startsWith('Journals/') && t.path.split('/').length === 2
  )

  const journalFiles = tree.filter(
    t => t.type === 'blob' && t.path.startsWith('Journals/') && t.path.split('/').length === 3
  )

  // File-level paths for journals/index.tsx pagination + counts
  const paths = journalFiles.map(f => {
    const parts = f.path.split('/')
    return { params: { dataset: parts[2], category: parts[1] } }
  })

  // Category data consumed by journals/index.tsx display
  const data = journalCats.map(cat => {
    const category = cat.path.split('/')[1]
    const files = journalFiles
      .filter(f => f.path.startsWith(cat.path + '/'))
      .map(f => ({
        name: f.path.split('/').pop() as string,
        path: f.path,
        html_url: ghFile(f.path),
        download_url: rawUrl(f.path),
        _links: { html: ghFile(f.path), self: apiUrl(f.path) },
      }))

    return {
      params: {
        category,
        data: { data: files, headers: {} },
      },
    }
  })

  return { paths, data, fallback: false as const }
}
