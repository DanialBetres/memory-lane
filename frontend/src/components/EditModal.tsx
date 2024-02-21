import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker'
import { Memory } from '@/utils/types'

export const EditModal = ({
  memory,
  closeModal,
}: {
  memory: Memory
  closeModal: () => void
}) => {
  const cancelButtonRef = useRef(null)
  const [memoryToEdit, setMemoryToEdit] = useState<Memory>(memory)
  const [value, setValue] = useState<DateValueType>({
    startDate: new Date().toLocaleDateString('en-CA'),
    endDate: new Date().toLocaleDateString('en-CA'),
  })
  const [error, setError] = useState<string | null>(null)

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!value?.startDate || !memory.name || !memory.description) {
      return setError('Please fill out all fields')
    }
    if (
      memory.name == memoryToEdit.name &&
      memory.description == memoryToEdit.description &&
      memory.timestamp == memoryToEdit.timestamp
    ) {
      closeModal()
    }
    try {
      const response = await fetch(
        `http://localhost:4001/memories/${memory.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memoryToEdit),
        }
      )

      if (!response.ok) {
        setError('There was a problem updating the memory. Try again later.')
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      setError('There was a problem updating the memory. Try again later.')
    }
    closeModal()
  }

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      Edit Memory
                    </Dialog.Title>
                    <div className='mt-2'>
                      {error && (
                        <div className='border-l-4 border-red-400 bg-red-50 p-4'>
                          <div className='flex'>
                            <div className='flex-shrink-0'>
                              <ExclamationTriangleIcon
                                className='h-5 w-5 text-red-400'
                                aria-hidden='true'
                              />
                            </div>
                            <div className='ml-3'>
                              <p className='text-sm text-red-700'>{error}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <form onSubmit={handleFormSubmit}>
                        <div className='space-y-12'>
                          <div className='border-b border-gray-900/10 pb-12'>
                            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 '>
                              <div className='col-span-full'>
                                <label
                                  htmlFor='date'
                                  className='block text-sm font-medium leading-6 text-gray-900 text-start'
                                >
                                  Date
                                </label>
                                <div className='mt-2'>
                                  <Datepicker
                                    value={value}
                                    onChange={handleValueChange}
                                    asSingle
                                    primaryColor='blue'
                                    useRange={false}
                                    disabledDates={[
                                      {
                                        startDate: new Date(
                                          new Date().getTime()
                                        )
                                          .toISOString()
                                          .split('T')[0],
                                        endDate: '2999-02-12',
                                      },
                                    ]}
                                  />
                                </div>
                              </div>
                              <div className='col-span-full'>
                                <label
                                  htmlFor='name'
                                  className='block text-sm font-medium leading-6 text-gray-900 text-start'
                                >
                                  Name
                                </label>
                                <div className='mt-2'>
                                  <input
                                    type='text'
                                    name='name'
                                    id='name'
                                    autoComplete='given-name'
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                    value={memoryToEdit.name}
                                    onChange={(event) =>
                                      setMemoryToEdit({
                                        ...memoryToEdit,
                                        name: event.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className='col-span-full'>
                                <label
                                  htmlFor='description'
                                  className='block text-sm font-medium leading-6 text-gray-900 text-start'
                                >
                                  Description
                                </label>
                                <div className='mt-2'>
                                  <textarea
                                    id='description'
                                    name='description'
                                    rows={3}
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                    defaultValue={''}
                                    value={memoryToEdit.description}
                                    onChange={(event) =>
                                      setMemoryToEdit({
                                        ...memoryToEdit,
                                        description: event.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                          <button
                            type='submit'
                            className='inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2'
                          >
                            Update Memory
                          </button>
                          <button
                            type='button'
                            className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                            onClick={() => closeModal()}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
