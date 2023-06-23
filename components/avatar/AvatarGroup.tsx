import { Avatar } from './Avatar'

export function AvatarGroup() {
  return (
   <div className="flex items-center justify-end h-[50vh] w-[52%]">
     <div className="flex [&>*:not(:last-child)]:hover:mr-1">
      <a href="https://github.com/rauchg" aria-label="rauchg" className="mr-[-20px] transition-all">
        <Avatar src="https://unavatar.io/github/rauchg" alt="rauchg" className="w-10 h-10" />
      </a>
      <a href="https://github.com/yyx990803" aria-label="yyx990803" className="mr-[-20px] transition-all">
        <Avatar src="https://unavatar.io/github/yyx990803" alt="yyx990803" className="w-10 h-10"/>
      </a>
      <a href="https://github.com/pacocoursey" aria-label="pacocoursey" className="mr-[-20px] transition-all">
        <Avatar src="https://unavatar.io/github/pacocoursey" alt="pacocoursey" className="w-10 h-10"/>
      </a>
      <a href="https://github.com/shuding" aria-label="shuding" className="mr-[-20px] transition-all">
        <Avatar src="https://unavatar.io/github/shuding" alt="shuding" className="w-10 h-10"/>
      </a>
      <a href="https://github.com/sokra" aria-label="sokra">
        <Avatar src="https://unavatar.io/github/sokra" alt="sokra" className="w-10 h-10" />
      </a>
    </div>
   </div>
  )
}
