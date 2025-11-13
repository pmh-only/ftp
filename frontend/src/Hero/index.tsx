import './style.css'
import '@fontsource-variable/oswald/index.css';

interface Props {
  className?: string
}

function Hero({ className }: Props) {
  return (
    <div className={className + " flex items-end md:items-start md:flex-col select-none pr-6 w-full md:w-auto md:min-h-full"}>
      <div className="grow md:grow-0">
        <div className="flex flex-col w-fit leading-none">
          <h1 className="font-bold italic font-display">
            <span className="font-thin">ftp</span>.io.kr.
          </h1>
          <div className="text-xs self-end bg-accent text-accent-content px-2">dir explorer</div>
        </div>
      </div>

      <div className="hidden md:flex text-xs flex-col gap-6 py-4 flex-1 grow">
        <div>
          <p>The</p>
          <p>Archlinux</p>
          <p>package mirror.</p>
        </div>

        <div>
          <p>In</p>
          <p>Chuncheon-si,</p>
          <p>Republic of Korea.</p>
        </div>

        <div>
          <p>By</p>
          <p><a href="https://github.com/pmh-only" target="_blank">Minhyeok Park</a>.</p>
          <p>Thanks to Oracle Cloud.</p>
        </div>

        <div>
          <p>Contact</p>
          <p><a href="https://github.com/pmh-only/ftp/issues" target="_blank">GitHub issue tracker.</a></p>
          <p><a href="mailto:pmh_only@pmh.codes" target="_blank">Direct email.</a></p>
          <p>Discord (@pmh_only)</p>
        </div>
      </div>

      <button className="btn btn-soft btn-accent md:w-full">
        Learn more
      </button>
    </div>
  )
}

export default Hero
