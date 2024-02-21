import { useEffect, useState } from 'react'
import {
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

import { EditModal } from '@/components/EditModal'
import { Memory, SortOrder } from '@/utils/types'
import { MemoryCard } from '@/components/MemoryCard'

export default function Home({
  searchQuery,
  sortOrder,
}: {
  searchQuery: string
  sortOrder: SortOrder
}) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([])
  const [error, setError] = useState<string>('')
  const [urlCopied, setUrlCopied] = useState<boolean>(false)
  const [memoryToEdit, setMemoryToEdit] = useState<Memory | undefined>(
    undefined
  )

  const router = useRouter()

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch('http://localhost:4001/memories')
        if (!response.ok) {
          setError('There was a problem fetching memories. Try again later.')
        }
        const { memories } = await response.json()
        setMemories(memories)
      } catch (err) {
        console.log('err', err)

        setError('There was a problem fetching memories. Try again later.')
      }
    }
    fetchMemories()
  }, [router.query.edit])

  useEffect(() => {
    const filteredMemories = memories.filter((memory) => {
      return (
        memory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    })

    if (sortOrder === 'Newest to Oldest') {
      filteredMemories.sort((a, b) => {
        return a.timestamp > b.timestamp ? -1 : 1
      })
    } else if (sortOrder === 'Oldest to Newest') {
      filteredMemories.sort((a, b) => {
        return a.timestamp < b.timestamp ? -1 : 1
      })
    } else {
      filteredMemories.sort((a, b) => {
        return a.name < b.name ? -1 : 1
      })
    }

    setFilteredMemories(filteredMemories)
  }, [searchQuery, sortOrder, memories])

  const onDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4001/memories/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        setError('There was a problem deleting the memory. Try again later.')
      }
      const newMemories = memories.filter((memory) => memory.id !== id)
      setMemories(newMemories)
    } catch (err) {
      setError('There was a problem deleting the memory. Try again later.')
    }
  }

  return (
    <div>
      {memoryToEdit && (
        <EditModal
          memory={memoryToEdit}
          closeModal={() => {
            router.replace('/', undefined, { shallow: true })

            setMemoryToEdit(undefined)
          }}
        />
      )}
      {urlCopied && (
        <div className='border-l-4 border-green-400 bg-green-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <ExclamationTriangleIcon
                className='h-5 w-5 text-green-400'
                aria-hidden='true'
              />
            </div>
            <div className='ml-3'>
              <p className='text-sm text-green-700'>
                URL has been copied to your clipboard. Share with a friend!
              </p>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className='rounded-md bg-red-50 p-4 mb-10'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <XCircleIcon
                className='h-5 w-5 text-red-400'
                aria-hidden='true'
              />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-red-800'>{error}</p>
            </div>
            <div className='ml-auto pl-3'>
              <div className='-mx-1.5 -my-1.5'>
                <button
                  type='button'
                  className='inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50'
                  onClick={() => setError('')}
                >
                  <span className='sr-only'>Dismiss</span>
                  <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ul
        role='list'
        className='space-y-6 flex flex-col items-center justify-center '
      >
        {filteredMemories.map((memory) => (
          <div
            key={memory.id}
            className='w-full h-full flex items-center justify-center'
          >
            <MemoryCard
              memory={memory}
              setUrlCopied={setUrlCopied}
              setMemoryToEdit={setMemoryToEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </ul>
    </div>
  )
}
