import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { SortOrder } from '@/utils/types'
import { classNames } from '@/utils/sharedFunctions'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'New Memory', href: '/new', icon: PlusCircleIcon, current: false },
]

const pagesToHideSearch = ['/new']

export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('Newest to Oldest')
  const router = useRouter()
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  useEffect(() => {
    if (router.query?.edit) {
      setEditMode(true)
    } else {
      setEditMode(false)
    }
    if (router.pathname === '/memories/[id]') {
      setViewMode(true)
    } else {
      setViewMode(false)
    }
  }, [router.query])

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-50 lg:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-900/80' />
            </Transition.Child>

            <div className='fixed inset-0 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                      <button
                        type='button'
                        className='-m-2.5 p-2.5'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4'>
                    <div className='flex h-16 shrink-0 items-center'>
                      <img
                        className='h-8 w-auto'
                        src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                        alt='Your Company'
                      />
                    </div>
                    <nav className='flex flex-1 flex-col'>
                      <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li>
                          <ul role='list' className='-mx-2 space-y-1'>
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    router.pathname === item.href
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      router.pathname === item.href
                                        ? 'text-indigo-600'
                                        : 'text-gray-400 group-hover:text-indigo-600',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden='true'
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className='mt-auto'>
                          <a
                            href='#'
                            className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                          >
                            <Cog6ToothIcon
                              className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                              aria-hidden='true'
                            />
                            Settings
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        {editMode ? null : (
          <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
            <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4'>
              <div className='flex h-16 shrink-0 items-center'>
                <img
                  className='h-auto w-auto'
                  src='/memoryLogo.svg'
                  alt='Your Company'
                />
              </div>
              {viewMode ? null : (
                <nav className='flex flex-1 flex-col'>
                  <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                    <li>
                      <ul role='list' className='-mx-2 space-y-1'>
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                router.pathname === item.href
                                  ? 'bg-gray-50 text-indigo-600'
                                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  router.pathname === item.href
                                    ? 'text-indigo-600'
                                    : 'text-gray-400 group-hover:text-indigo-600',
                                  'h-6 w-6 shrink-0'
                                )}
                                aria-hidden='true'
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className='mt-auto'>
                      <a
                        href='#'
                        className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      >
                        <Cog6ToothIcon
                          className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                          aria-hidden='true'
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        )}

        <div className='lg:pl-72'>
          <div className='sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8'>
            {pagesToHideSearch.includes(router.pathname) || editMode ? null : (
              <div className='flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none'>
                <button
                  type='button'
                  className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className='sr-only'>Open sidebar</span>
                  <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                </button>

                <>
                  <div
                    className='h-6 w-px bg-gray-200 lg:hidden'
                    aria-hidden='true'
                  />

                  <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
                    <form
                      className='relative flex flex-1'
                      action='#'
                      method='GET'
                    >
                      <label htmlFor='search-field' className='sr-only'>
                        Search
                      </label>
                      <MagnifyingGlassIcon
                        className='pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400'
                        aria-hidden='true'
                      />
                      <input
                        id='search-field'
                        className='block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm'
                        placeholder='Search...'
                        type='search'
                        name='search'
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                      />
                    </form>
                    <div className='flex items-center gap-x-4 lg:gap-x-6'>
                      <Menu
                        as='div'
                        className='relative inline-block text-left'
                      >
                        <div>
                          <Menu.Button className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                            {sortOrder}
                            <ChevronDownIcon
                              className='-mr-1 h-5 w-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-100'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'
                        >
                          <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <div className='py-1'>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                      'block px-4 py-2 text-sm'
                                    )}
                                    onClick={() =>
                                      setSortOrder('Newest to Oldest')
                                    }
                                  >
                                    Newest to Oldest
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                      'block px-4 py-2 text-sm'
                                    )}
                                    onClick={() =>
                                      setSortOrder('Oldest to Newest')
                                    }
                                  >
                                    Oldest to Newest
                                  </a>
                                )}
                              </Menu.Item>

                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                      'block px-4 py-2 text-sm'
                                    )}
                                    onClick={() =>
                                      setSortOrder('Alphabetical by Name')
                                    }
                                  >
                                    Alphabetical by Name
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <div
                        className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200'
                        aria-hidden='true'
                      />

                      <img
                        className='h-8 w-8 rounded-full bg-gray-50'
                        src={'/danial.jpg'}
                        alt=''
                      />
                      <span className='hidden lg:flex lg:items-center'>
                        <span
                          className='text-sm font-semibold leading-6 text-gray-900'
                          aria-hidden='true'
                        >
                          Danial Betres
                        </span>
                      </span>
                    </div>
                  </div>
                </>
              </div>
            )}
          </div>

          <main className='py-10'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <Component
                {...pageProps}
                searchQuery={searchQuery}
                sortOrder={sortOrder}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
