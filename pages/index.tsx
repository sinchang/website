import type { NextPage } from 'next'
import Link from 'next/link'
import { Avatar } from '../components/avatar'
import { SocialIcons } from '../components/SocialIcons'
import { Projects } from '../components/Projects'
import { CheckIn } from '../components/CheckIn'

const uiSnippets: {
  url: string
  name: string
}[] = [{
  url: '/ui/avatar',
  name: 'Avatar Group',
}, {
  url: '/ui/player',
  name: 'Audio Player',
},
{
  url: '/ui/flight',
  name: 'Flight Widget',
}]

const Home: NextPage = () => {
  return (
    <div className="mx-auto max-w-[80%] px-[1vw] lg:mx-0 lg:max-w-[50%] lg:pl-[10vw] lg:pt-[10vh]">
      <Avatar src="https://unavatar.io/github/sinchang" alt="Jeff Wen" width={100} height={100} />
      <div className="my-6 text-xl">
        👋 I'm Jeff, currently working at a Ecommerce company as a frontend engineer,
        interested in Design System, and focus on React Ecosystem. I was born
        and raised in Cangnan, Wenzhou, now living in Shanghai.
      </div>
      <SocialIcons />
      <div className='my-16 h-0.5 w-full bg-black dark:bg-white'></div>
      <div>
        <h1 className='pl-3 text-xl font-bold'>UI</h1>
        <ul className='mt-3'>
          {uiSnippets.map(ui => (
            <li key={ui.url} ><Link href={ui.url} className='block w-[100%] rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800'>{ui.name}</Link></li>
          ))}
        </ul>
      </div>
      <div className='my-16 h-0.5 w-full bg-black dark:bg-white'></div>
      <div>
        <h1 className='pl-3 text-xl font-bold'>Projects</h1>
        <Projects />
      </div>
      <div className='my-16'>
        <CheckIn />
      </div>
    </div>
  )
}

export default Home
