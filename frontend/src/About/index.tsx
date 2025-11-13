interface Props {
  className?: string
}

function About({ className }: Props) {
  return (
    <div className={className + ' overflow-y-auto p-2'}>
      <div
        className="hero bg-base-300 h-full max-h-64 rounded-2xl"
        style={{ backgroundImage: 'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)' }}>
        <div className="hero-overlay"></div>
        <div className="flex flex-col justify-end items-start p-6 pb-8 w-full h-full gap-2 italic">
          <h1 className="font-bold italic font-display text-6xl">
            <span className="font-thin">ftp</span>.io.kr.
          </h1>
        </div>
      </div>
    </div>
  )
}

export default About