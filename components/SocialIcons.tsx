export function SocialIcons() {
  return (
    <div className="my-6 flex gap-4">
      <a
        href="https://x.com/sinchangwen"
        target="_blank"
        title="Jeff Wen X"
        className="h-6 w-6" rel="noreferrer"
      >
        <span className="i-ri-twitter-fill h-full w-full"></span>
      </a>
      <a
        href="https://github.com/sinchang"
        target="_blank"
        title="Jeff Wen GitHub"
        className="h-6 w-6" rel="noreferrer"
      >
       <span className="i-ri-github-fill h-full w-full"></span>
      </a>
      <a
        href="mailto:hi@sinchang.me"
        className="h-6 w-6" rel="noreferrer"
      >
       <span className="i-ri-mail-fill h-full w-full"></span>
      </a>
    </div>
  )
}
