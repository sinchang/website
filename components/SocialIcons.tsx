export function SocialIcons() {
  return (
    <div className="mt-5 flex gap-4">
      <a
        href="https://github.com/sinchang"
        target="_blank"
        title="Jeff Wen GitHub"
        className="h-5 w-5 text-white/40 transition-colors hover:text-white/80"
        rel="noreferrer"
      >
        <span className="i-ri-github-fill h-full w-full" />
      </a>
      <a
        href="mailto:hi@sinchang.me"
        className="h-5 w-5 text-white/40 transition-colors hover:text-white/80"
        rel="noreferrer"
      >
        <span className="i-ri-mail-fill h-full w-full" />
      </a>
    </div>
  )
}
