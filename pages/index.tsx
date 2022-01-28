import type { NextPage } from 'next'
import { Avatar } from '../components/Avatar'
import { SocialIcons } from '../components/SocialIcons'

const Home: NextPage = () => {
  return (
    <div className="wrapper">
      <Avatar />
      <div className="intro">
        👋 I'm Jeff, currently working at iHerb as a frontend engineer,
        interested in Design System, and focus on React Ecosystem. I was born
        and raised in Cangnan, Wenzhou, now living in Shanghai.
      </div>
      <SocialIcons />
      <style jsx>{`
        .wrapper {
          max-width: 50%;
          padding-left: 10vw;
          padding-top: 10vh;
        }

        @media screen and (max-width: 576px) {
          .wrapper {
            max-width: 80%;
            margin: 0 auto;
            padding-left: 1vw;
            padding-right: 1vw;
          }
        }

        .intro {
          font-size: 20px;
          margin: 20px 0;
        }
      `}</style>
    </div>
  )
}

export default Home
