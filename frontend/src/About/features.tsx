import { Award, Gauge, HatGlasses, Laugh, SearchCheck } from 'lucide-react'

function AboutFeatures() {
  return (
    <div
      id="features"
      className="w-full min-h-full flex justify-center flex-col snap-start"
    >
      <div className="flex flex-col gap-8">
        <h2 className="font-display italic text-4xl font-bold text-center">
          The <span className="underline decoration-accent">Features.</span>
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          <div className="hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Performance.</span>
                  <span className="text-5xl opacity-25">
                    <Gauge className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr utilizes <b className="text-accent">4 Gbps</b>{' '}
                  stable egress bandwidth without any connection limits. Also
                  webserver fully supports{' '}
                  <b className="text-accent">HTTP/3 QUIC</b> with TLS/QUIC early
                  data packet!
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

          <div className="hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Reliable.</span>
                  <span className="text-5xl opacity-25">
                    <Laugh className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr targets <b className="text-accent">99.9%</b> monthly
                  availablity! with Kuberenetes' deployment strategy, I
                  implemented <b className="text-accent">zero-downtime</b>{' '}
                  rolling updates.
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

          <div className="hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Anonymously.</span>
                  <span className="text-5xl opacity-25">
                    <HatGlasses className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr <b className="text-accent">does not</b> collect any
                  tracking data, cookie and even{' '}
                  <b className="text-accent">ip address</b>! for who really
                  cares about privacy just check out my nginx configuration.
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

          <div className="hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Transparent.</span>
                  <span className="text-5xl opacity-25">
                    <SearchCheck className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr <b className="text-accent">open sourced</b>{' '}
                  <b>entire infra</b> including K8s manifest files, nginx web
                  server configuration, indexer source code and shell scripts!
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

          <div className="hover-3d">
            <div className="card bg-base-300 w-82 shadow-sm">
              <div className="card-body bg-base-200">
                <h2 className="card-title flex justify-between items-end">
                  <span>Trust & Secure.</span>
                  <span className="text-5xl opacity-25">
                    <Award className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  ftp.io.kr implemented GitOps/
                  <b className="text-accent">Single-Source-Of-Truth</b> with
                  ArgoCD and Github Actions! and also supports{' '}
                  <b className="text-accent">Post Quantum Cryptography</b> with
                  proper TLS configs
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
