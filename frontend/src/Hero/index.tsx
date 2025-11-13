import './style.css'
import '@fontsource-variable/oswald/index.css';

interface Props {
  className?: string
}

function Hero({ className }: Props) {
  return (
    <div className={className + " flex items-end xl:items-start xl:flex-col select-none pr-6 w-full xl:w-auto xl:min-h-full"}>
      <div className="grow xl:grow-0">
        <div className="flex flex-col w-fit leading-none">
          <h1 className="font-bold italic font-display">
            <span className="font-thin">ftp</span>.io.kr.
          </h1>
          <div className="text-xs self-end bg-accent text-accent-content px-2">dah mirror</div>
        </div>
      </div>

      <div className="hidden xl:flex text-xs flex-col gap-6 py-4 flex-1 grow">
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

      <button className="btn btn-soft btn-accent xl:w-full">
        Learn more
      </button>
    </div>
  )
}

export default Hero
