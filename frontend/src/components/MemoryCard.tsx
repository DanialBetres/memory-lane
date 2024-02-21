import { Dispatch, Fragment, SetStateAction, useCallback } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import useEmblaCarousel from 'embla-carousel-react'
import { RevolvingDot } from 'react-loader-spinner'

import { Memory } from '@/utils/types'
import { classNames } from '@/utils/sharedFunctions'

export const pillColour = (idx: number): string => {
  const colours = [
    'bg-red-50 text-red-700 ring-red-600/10',
    'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    'bg-green-50 text-green-700 ring-green-600/20',
    'bg-blue-50 text-blue-700 ring-blue-700/10',
    'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
    'bg-purple-50 text-purple-700 ring-purple-700/10',
    'bg-pink-50 text-pink-700 ring-pink-700/10',
    'bg-gray-50 text-gray-600 ring-gray-500/10',
  ]
  return colours[idx % colours.length]
}

export const MemoryCard = ({
  memory,
  setUrlCopied,
  setMemoryToEdit,
  onDelete,
}: {
  memory: Memory
  setUrlCopied?: Dispatch<SetStateAction<boolean>>
  setMemoryToEdit?: Dispatch<SetStateAction<Memory | undefined>>
  onDelete?: (id: number) => Promise<void>
}) => {
  const router = useRouter()
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!memory) {
    return (
      <div className='my-10'>
        <RevolvingDot
          visible={true}
          height='80'
          width='80'
          color='#4F46E5'
          ariaLabel='revolving-dot-loading'
          wrapperClass='flex justify-center items-center'
        />
      </div>
    )
  }

  return (
    <li
      key={memory.id}
      className='overflow-hidden bg-white px-4 py-4 shadow-xl sm:rounded-md sm:px-10 sm:py-7 w-full max-w-2xl'
    >
      <div className='flex flex-row justify-between'>
        <div className='text-2xl text-gray-900'>{memory.name}</div>
        {router.pathname === '/memories/[id]' ? null : (
          <Menu as='div' className='relative ml-auto'>
            <Menu.Button className='-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500'>
              <span className='sr-only'>Open options</span>

              <div className='text-gray-900'>
                <EllipsisVerticalIcon className='h-full w-6' />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900'
                      )}
                      onClick={() => {
                        if (setUrlCopied === undefined) return

                        const url = `${window.location.href}memories/${memory.id}`
                        navigator.clipboard.writeText(url)
                        setUrlCopied(true)
                        setTimeout(() => {
                          setUrlCopied(false)
                        }, 3000)
                      }}
                    >
                      Share
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900'
                      )}
                      onClick={() => {
                        if (setMemoryToEdit === undefined) return
                        setMemoryToEdit(memory)
                        router.query.edit = 'true'
                        router.push(router)
                      }}
                    >
                      Edit
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900'
                      )}
                      onClick={() => {
                        if (onDelete === undefined) return
                        onDelete(memory.id)
                      }}
                    >
                      Delete
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
      {memory.tags.map((tag, idx) => {
        return (
          <span
            className={classNames(
              pillColour(idx),
              idx == 0 ? 'ml-0 mr-1' : 'mx-1',
              'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset mb-2 mt-3'
            )}
          >
            {tag}
          </span>
        )
      })}
      <div className='text-md text-gray-500 my-4'>{memory.timestamp}</div>
      <div className='text-lg text-gray-800'>{memory.description}</div>
      <div
        className='overflow-hidden flex flex-col justify-center items-center'
        ref={emblaRef}
      >
        <div className='flex mt-4'>
          {memory.pictures.map((picture, idx) => {
            return (
              <img
                key={idx}
                src={picture}
                className='min-w-0 h-56 object-contain flex-grow-0 flex-shrink-0 basis-full rounded-md'
              />
            )
          })}
        </div>

        {memory.pictures.length > 1 && (
          <div className='flex flex-row justify-center items-center'>
            <button
              className='w-20 h-20 flex justify-center items-center'
              onClick={scrollPrev}
            >
              <ArrowLeftCircleIcon className='text-black h-8 w-8' />
            </button>
            <button
              className='w-20 h-20 flex justify-center items-center'
              onClick={scrollNext}
            >
              <ArrowRightCircleIcon className='text-black h-8 w-8' />
            </button>
          </div>
        )}
      </div>
    </li>
  )
}
