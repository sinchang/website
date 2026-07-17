export function SocialIcons() {
  return (
    <div className="mt-5 flex gap-4">
      <a
        href="https://github.com/sinchang"
        target="_blank"
        title="Jeff Wen GitHub"
        className="size-5 text-gray-400 transition-colors hover:text-gray-700 dark:text-white/40 dark:hover:text-white/80"
        rel="noreferrer"
      >
        <span className="i-ri-github-fill size-full" />
      </a>
      <a
        href="mailto:hi@sinchang.me"
        className="size-5 text-gray-400 transition-colors hover:text-gray-700 dark:text-white/40 dark:hover:text-white/80"
        rel="noreferrer"
      >
        <span className="i-ri-mail-fill size-full" />
      </a>
      {/* <Link
        href="/photos"
        title="Photos"
        className="h-5 w-5 text-gray-400 transition-colors hover:text-gray-700 dark:text-white/40 dark:hover:text-white/80"
      >
        <span className="i-ri-camera-line h-full w-full" />
      </Link> */}
    </div>
  )
}
