import Link from 'next/link'
import { ToggleTheme } from './ToggleTheme'

export function Header() {
  return (
    <div className="flex justify-between p-6">
      <Link href="/">jeff wen</Link>
      <div className="flex items-center gap-3">
        <Link href="https://resume.sinchang.me/resume.pdf">
          <span>Resume</span>
        </Link>
        {/* <Link href="https://wiki.sinchang.me?utm_source=sinchang">
          <span>wiki</span>
        </Link> */}
        <ToggleTheme />
      </div>
    </div>
  )
}
