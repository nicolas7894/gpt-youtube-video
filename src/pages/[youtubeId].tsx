import Chat from '@/components/chat/Chat'
import { Fragment } from 'react'
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
