import { Gauge, HatGlasses, Laugh, Pizza, SearchCheck } from 'lucide-react'

function AboutFeatures() {
  return (
    <div
      id="features"
      className="w-full min-h-full mt-16 flex justify-center flex-col py-6"
    >
      <div className="flex flex-col gap-8">
        <h2 className="font-display italic text-4xl font-bold text-center">
          The <span className="underline decoration-accent">Features.</span>
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          <div className="sm:hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Performance.</span>
                  <span className="text-5xl opacity-25">
                    <Gauge className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr delivers <b className="text-accent">4 Gbps</b> of
                  stable egress bandwidth, powered by Oracle Cloud
                  Infrastructure, with no limits on parallel connections.
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="sm:hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Reliable.</span>
                  <span className="text-5xl opacity-25">
                    <Laugh className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr is designed for <b className="text-accent">99.9%</b>{' '}
                  monthly availability and delivers{' '}
                  <b className="text-accent">zero-downtime</b> rolling updates
                  through Kubernetes deployment strategies.
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="sm:hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Anonymous.</span>
                  <span className="text-5xl opacity-25">
                    <HatGlasses className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr <b className="text-accent">does not</b> collect any
                  tracking data, cookies, or{' '}
                  <b className="text-accent">IP addresses</b>. Privacy-conscious
                  users can verify this directly in the nginx configuration.
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="sm:hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Transparent.</span>
                  <span className="text-5xl opacity-25">
                    <SearchCheck className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr is <b className="text-accent">fully open source</b>,
                  with all Kubernetes manifests, nginx configurations, indexer
                  source code, and supporting shell scripts publicly available.
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="sm:hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>And... Short URL.</span>
                  <span className="text-5xl opacity-25">
                    <Pizza className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  <b className="text-accent">ftp.io.kr</b> is short by design.
                  With only Arch Linux packages hosted, access requires no path
                  prefix.
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <h2 className="italic font-light text-center">
          But wait, there's more...
        </h2>
      </div>
    </div>
  )
}

export default AboutFeatures
