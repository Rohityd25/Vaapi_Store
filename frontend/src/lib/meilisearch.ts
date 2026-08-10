import { Meilisearch as MeiliSearch } from 'meilisearch'

export const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY,
})

export const PRODUCTS_INDEX = 'products'

export interface ProductSearchDocument {
  id: string
  title: string
  slug: string
  description: string
  brand?: string
  basePrice: number
  compareAtPrice?: number
  categoryId?: string
  categoryName?: string
  imageUrl?: string
  isBestseller: boolean
  isNewArrival: boolean
  tags: string[]
  sizes: string[]
  colors: string[]
  isActive: boolean
}

export async function indexProduct(product: ProductSearchDocument) {
  const index = meilisearch.index(PRODUCTS_INDEX)
  await index.addDocuments([product])
}

export async function removeProductFromIndex(productId: string) {
  const index = meilisearch.index(PRODUCTS_INDEX)
  await index.deleteDocument(productId)
}

export async function searchProducts(
  query: string,
  options: {
    limit?: number
    offset?: number
    filters?: string
    sort?: string[]
  } = {}
) {
  const index = meilisearch.index(PRODUCTS_INDEX)
  return index.search(query, {
    limit: options.limit || 20,
    offset: options.offset || 0,
    filter: options.filters,
    sort: options.sort,
    attributesToHighlight: ['title', 'description'],
  })
}

export async function setupMeilisearchIndex() {
  const index = meilisearch.index(PRODUCTS_INDEX)

  await index.updateSettings({
    searchableAttributes: ['title', 'description', 'brand', 'tags', 'categoryName'],
    filterableAttributes: ['categoryId', 'isBestseller', 'isNewArrival', 'isActive', 'sizes', 'colors', 'basePrice'],
    sortableAttributes: ['basePrice', 'createdAt'],
    displayedAttributes: ['id', 'title', 'slug', 'description', 'brand', 'basePrice', 'compareAtPrice', 'imageUrl', 'isBestseller', 'isNewArrival', 'tags', 'sizes', 'colors'],
  })
}
