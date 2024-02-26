export function Projects() {
  return <section className="pl-3 antialiased">
    <div className="mx-auto max-w-screen-xl">
      <div className="mt-3 grid grid-cols-1 gap-x-20 gap-y-12 text-center">
        <div className="space-y-4 text-left">
          <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
            qrcode-parser
          </h3>
          <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
            A pure javascript QR code decoding library, accept Image File object, image url, image base64. 10k download per month on npm.
          </p>
          <div>
            {/* https://flowbite.com/docs/components/badge/ */}
            <span className="me-2 rounded bg-pink-100 px-2.5 py-0.5 text-sm font-medium text-pink-800 dark:bg-pink-900 dark:text-pink-300">NPM</span>
            <span className="me-2 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">TypeScript</span>
          </div>
          <div className="flex gap-3">
            <a href="https://github.com/sinchang/qrcode-parser" title=""
              className="inline-flex items-center justify-center rounded-lg text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              <span className="i-ri-github-fill mr-2 h-4 w-4"></span>
              <span>
                Source Code
              </span>
            </a>
            <a href="https://qrcode-parser.netlify.com" title=""
              className="inline-flex items-center justify-center rounded-lg text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              <span className="i-ri-safari-fill mr-2 h-4 w-4"></span>
              <span>
                Website
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
}
