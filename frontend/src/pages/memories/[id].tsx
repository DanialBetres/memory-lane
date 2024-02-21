import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'

import { MemoryCard } from '@/components/MemoryCard'
import { Memory } from '@/utils/types'

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('http://localhost:4001/memories')
  if (!response.ok) {
  }
  const { memories } = await response.json()
  const paths = memories.map((doc: Memory) => {
    return {
      params: { id: doc.id.toString() },
    }
  })

  return { paths: paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  if (context?.params?.id) {
    const response = await fetch(
      `http://localhost:4001/memories/${context.params.id}`
    )
    const memory = await response.json()
    return {
      props: {
        memory: memory?.memory || null,
      },
    }
  }

  return {
    props: {},
  }
}

export const MemoryPage = ({ memory }: { memory: Memory }) => {
  return (
    <div className='flex flex-1 flex-col justify-center items-center '>
      <h2 className='text-base font-semibold leading-7 text-gray-900'>
        Danial's Memory
      </h2>
      <MemoryCard memory={memory} />
      <div className='relative  text-sm leading-6 text-gray-600 mt-5'>
        Never forget your memories.
        <a href='#' className='font-semibold text-indigo-600'>
          <span className='absolute inset-0' aria-hidden='true' /> Get started
          today
        </a>
      </div>
    </div>
  )
}

export default MemoryPage
