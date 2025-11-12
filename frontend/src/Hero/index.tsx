import './style.css'

interface Props {
  className?: string
}

function Hero({ className }: Props) {
  return (
    <div className={className + " pr-6 flex flex-col gap-6"}>
      <h1 className="font-bold"><span className="font-light">ftp</span>.io.kr</h1>

      <div className="hidden xl:block text-xs">
        <p>The Archlinux</p>
        <p>Package Mirror</p>
      </div>
    </div>
  )
}

export default Hero
