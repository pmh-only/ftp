import './style.css'
import '@fontsource-variable/oswald/index.css';

interface Props {
  className?: string
}

function Hero({ className }: Props) {
  return (
    <div className={className + " select-none pr-6"}>
      <h1 className="font-bold italic font-display">
        <span className="font-thin">ftp</span>.io.kr.
      </h1>

      <div className="hidden xl:flex text-xs flex-col gap-6 py-4">
        <div>
          <p>An</p>
          <p>Archlinux</p>
          <p>Package Mirror</p>
        </div>

        <div>
          <p>By</p>
          <p>
            <a href="https://github.com/pmh-only" target="_blank">
              Minhyeok Park
            </a>.
          </p>
          <p>Thanks to Oracle Cloud.</p>
        </div>

        <div>
          <p>Heres</p>
          <p><a href="https://github.com/pmh-only/ftp" target="_blank">Source Code</a>.</p>
          <p><a href="mailto:pmh_only@pmh.codes" target="_blank">Maintainer's Inbox</a>.</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
