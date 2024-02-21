import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { RevolvingDot } from 'react-loader-spinner'
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker'

import { UploadButton } from '../utils/uploadThing'

export const New = () => {
  const [value, setValue] = useState<DateValueType>({
    startDate: new Date().toLocaleDateString('en-CA'),
    endDate: new Date().toLocaleDateString('en-CA'),
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<{
    name: string
    description: string
    pictures: string[]
  }>({
    name: '',
    description: '',
    pictures: [],
  })

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    if (!value?.startDate || !formData.name || !formData.description) {
      setLoading(false)
      return setError('Please fill out all fields')
    }

    setError(null)

    const dataToSend = {
      timestamp: value?.startDate || new Date().toLocaleDateString('en-CA'),
      name: formData.name,
      description: formData.description,
      pictures: formData.pictures,
    }

    try {
      const response = await fetch('http://localhost:4001/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        setError('There was a problem adding a memory. Try again later.')
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setValue({
        startDate: new Date().toLocaleDateString('en-CA'),
        endDate: new Date().toLocaleDateString('en-CA'),
      })
      setFormData({ name: '', description: '', pictures: [] })
      setSuccess('Memory added successfully!')
      setTimeout(() => setSuccess(null), 1500)
    } catch (error) {
      setError('There was a problem adding a memory. Try again later.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='space-y-12'>
        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            New Memory
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            Add a new memory to your collection. Be as descriptive as possible.
            You won't want to forget the details!
          </p>

          {loading ? (
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
          ) : (
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 '>
              <div className='w-fit'>
                <label
                  htmlFor='date'
                  className='block text-sm font-medium leading-6 text-gray-900'
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
                        startDate: new Date(new Date().getTime())
                          .toISOString()
                          .split('T')[0],
                        endDate: '2999-02-12',
                      },
                    ]}
                  />
                </div>
              </div>
              <div className='w-96'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium leading-6 text-gray-900'
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
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium leading-6 text-gray-900'
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
                    value={formData.description}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        description: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='col-span-full'>
                <label
                  htmlFor='pictures'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Pictures
                </label>
                <div className='mt-2'>
                  <UploadButton
                    endpoint='imageUploader'
                    onClientUploadComplete={(res) => {
                      setFormData({
                        ...formData,
                        pictures: [...formData.pictures, res[0].url],
                      })
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`)
                    }}
                  />
                  <div className='flex flex-row'>
                    {formData.pictures.map((picture, idx) => {
                      return (
                        <div key={idx} className='mt-2 mx-2'>
                          <img
                            src={picture}
                            alt='memory-picture'
                            className='w-52 h-fit rounded-md'
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
      {success && (
        <div className='border-l-4 border-green-400 bg-green-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <ExclamationTriangleIcon
                className='h-5 w-5 text-green-400'
                aria-hidden='true'
              />
            </div>
            <div className='ml-3'>
              <p className='text-sm text-green-700'>{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='submit'
          disabled={loading}
          className='rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default New
