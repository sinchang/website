import Link from 'next/link'
import { ToggleTheme } from './ToggleTheme'

export const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <Link href="/">jeff wen</Link>
      </div>
      <div className="header-right">
        <Link href="/">
          <a className="nav-item">project</a>
        </Link>
        <Link href="/">
          <a className="nav-item">about</a>
        </Link>
        <ToggleTheme />
      </div>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          padding: 24px 20px;
        }
        .nav-item {
          padding-right: 12px;
          display: block;
        }
        .header-right {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
}
