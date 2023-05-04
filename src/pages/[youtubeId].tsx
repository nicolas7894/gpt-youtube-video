import Chat from '@/components/chat/Chat'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
const Home = () => {
  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="mx-auto max-w-7xl  sm:px-6 lg:px-8">
            <Chat />
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
