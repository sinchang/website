import type { NextPage } from 'next'
import { Avatar } from '../components/avatar'
import { SocialIcons } from '../components/SocialIcons'

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
    </div>
  )
}

export default Home
