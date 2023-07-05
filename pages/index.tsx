import type { NextPage } from 'next'
import Link from 'next/link'
import { Avatar } from '../components/avatar'
import { SocialIcons } from '../components/SocialIcons'

const uiSnippets: {
  url: string
  name: string
}[] = [{
  url: '/ui/avatar',
  name: 'Avatar Group',
}]

const Home: NextPage = () => {
  return (
    <div className="lg:max-w-[50%] max-w-[80%] lg:pl-[10vw] lg:pt-[10vh] pl-[1vw] pr-[1vw] lg:mx-0 mx-auto">
      <Avatar src="https://unavatar.io/github/sinchang" alt="Jeff Wen" width={100} height={100} />
      <div className="text-xl my-6">
        👋 I'm Jeff, currently working at a Ecommerce company as a frontend engineer,
        interested in Design System, and focus on React Ecosystem. I was born
        and raised in Cangnan, Wenzhou, now living in Shanghai.
      </div>
      <SocialIcons />
      <div className='mt-36'>
        <h1 className='font-bold text-xl pl-3'>UI</h1>
        <ul className='mt-3'>
          {uiSnippets.map(ui => (
            <li key={ui.url} ><Link href={ui.url} className='p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg w-[100%] block'>{ui.name}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home
