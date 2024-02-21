export type SortOrder =
  | 'Newest to Oldest'
  | 'Oldest to Newest'
  | 'Alphabetical by Name'

export type Memory = {
  id: number
  name: string
  description: string
  timestamp: string
  pictures: string[]
  tags: string[]
}
