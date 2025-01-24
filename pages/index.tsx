import type { NextPage } from 'next'
import { Avatar } from '../components/avatar'
import { SocialIcons } from '../components/SocialIcons'
import { Projects } from '../components/Projects'
import { CheckIn } from '../components/CheckIn'


const Home: NextPage = () => {
  return (
    <div className="mx-auto max-w-[80%] px-[1vw] lg:mx-0 lg:max-w-[50%] lg:pl-[10vw] lg:pt-[10vh]">
      <Avatar src="https://unavatar.io/github/sinchang" alt="Jeff Wen" width={100} height={100} />
      <div className="my-6 text-xl">
        👋 I'm Jeff, currently working at a Ecommerce company as a frontend engineer. I was born
        and raised in Cangnan, Wenzhou, now living in Shanghai.
      </div>
      <SocialIcons />
      <div className='my-16 h-0.5 w-full bg-black dark:bg-white'></div>
      <div>
        <h1 className='pl-3 text-xl font-bold'>Projects</h1>
        <Projects />
      </div>
      <div className='my-16 h-0.5 w-full bg-black dark:bg-white'></div>
      <CheckIn />
    </div>
  )
}

export default Home
