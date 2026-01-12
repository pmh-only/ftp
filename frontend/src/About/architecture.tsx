import { BookText, FolderSync, Globe } from 'lucide-react'

function AboutArchitecture() {
  return (
    <div
      id="architecture"
      className="w-full mt-16 flex justify-center flex-col py-6 min-h-full"
    >
      <div className="flex flex-col gap-8">
        <h2 className="font-display italic text-4xl font-bold text-center">
          The <span className="underline decoration-accent">Architecture.</span>
        </h2>

        <div className="flex flex-col items-center gap-6">
          <img
            src="/_assets/architecture.webp"
            className="hidden lg:block w-full max-w-3xl object-contain"
          />
          <img
            src="/_assets/architecture_single.webp"
            className="block lg:hidden w-full object-contain"
          />

          <section className="flex gap-6 flex-wrap justify-center">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Indexer.</span>
                  <span className="text-5xl opacity-25">
                    <BookText className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  The indexer is a Go-based service that scans synchronized
                  repositories and pre-generates directory listings.
                </p>
                <p>
                  It produces both <code>.html</code> and <code>.json</code>{' '}
                  index files, enabling fast static delivery and programmatic
                  access without per-request processing.
                </p>
                <div className="card-actions justify-end">
                  <a
                    href="https://github.com/pmh-only/ftp/tree/main/indexer"
                    target="_blank"
                    className="btn btn-accent"
                  >
                    Show Source
                  </a>
                </div>
              </div>
            </div>
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Web Server.</span>
                  <span className="text-5xl opacity-25">
                    <Globe className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  The web server is powered by <strong>nginx</strong> and serves
                  package files, pre-generated indexes, and frontend assets.
                </p>
                <p>
                  By serving static content directly, it delivers high
                  performance and consistent response times, even for very large
                  directories.
                </p>
                <div className="card-actions justify-end">
                  <a
                    href="https://github.com/pmh-only/ftp/tree/main/webserver"
                    target="_blank"
                    className="btn btn-accent"
                  >
                    Show Source
                  </a>
                </div>
              </div>
            </div>
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>SyncRepo.</span>
                  <span className="text-5xl opacity-25">
                    <FolderSync className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  SyncRepo is a shell-based synchronization process that mirrors
                  upstream repositories to each Kubernetes node.
                </p>
                <p>
                  After syncing completes, it automatically triggers the indexer
                  to regenerate directory listings, ensuring content stays up to
                  date.
                </p>
                <div className="card-actions justify-end">
                  <a
                    href="https://github.com/pmh-only/ftp/tree/main/syncrepo"
                    target="_blank"
                    className="btn btn-accent"
                  >
                    Show Source
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutArchitecture
