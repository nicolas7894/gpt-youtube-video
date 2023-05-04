import Loader from '@/components/Loader'
import { Router, useRouter } from 'next/router'
import { useState, useEffect, ChangeEvent } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const Home = () => {
  const Router = useRouter()
  const [youtubeUrl, setYoutubeUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const retrieveVideoId = (url: string) => {
    return url.replace('https://www.youtube.com/watch?v=', '')
  }
  const loadVideo = async () => {
    if (youtubeUrl === '') {
      return
    }
    setIsLoading(true)

    try {
      const videoId = retrieveVideoId(youtubeUrl)

      const response = await fetch(`/api/store?videoId=${videoId}`)
      const data = await response.json()
      if (response.ok) {
        Router.push(`/${videoId}`)
      } else {
        setErrorMessage(data.error)
      }
    } catch (error) {
      setErrorMessage('Error fetching video')
    }
    setIsLoading(false)
  }

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          GPTUBE
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Chat with youtube video
        </p>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Youtube URL or ID
            </label>
            <div className="mt-2.5">
              <input
                disabled = {isLoading}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setYoutubeUrl(e.target.value)
                }
                type="text"
                name="youtube"
                placeholder="https://www.youtube.com/watch?v=..."
                id="youtube"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={isLoading}
            onClick={loadVideo}
            className="relative flex items-center justify-center w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading && <Loader />}
            <div className="flex items-center justify-center">Let&apos;s chat</div>
          </button>
        </div>
      </form>
      <div className="fixed bottom-0 w-full">
        <a
          href="https://twitter.com/nicolas_tch"
          target="_blank"
          className="border flex my-8 float-left px-5 py-2 bg-blue text-black text-sm font-bold tracking-wide rounded-full focus:outline-none"
        >
          Support me on twitter
          <svg
            className="ml-3 w-6 h-6 text-blue-300 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default Home
