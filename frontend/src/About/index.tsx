interface Props {
  className?: string
}

function About({ className }: Props) {
  return (
    <div className={className + ' overflow-y-auto p-2 flex gap-6'}>
      <div
        className="hero bg-base-300 h-full max-h-42 md:max-h-64 rounded-2xl"
        style={{ backgroundImage: 'url(/_assets/aboutbg.webp)' }}>
        <div className="flex flex-col justify-end items-start p-6 pb-8 w-full h-full gap-2 italic">
          <h1 className="font-bold italic font-display text-6xl">
            <span className="font-thin">ftp</span>.io.kr.
          </h1>
        </div>
      </div>

      <div className="mockup-code w-full">
        <pre data-prefix="$"><code>sudo vi /etc/pacman.d/mirrorlist</code></pre>
        <pre data-prefix="1" className="text-info"><code>##</code></pre>
        <pre data-prefix="2" className="text-info"><code>## Arch Linux repository mirrorlist</code></pre>
        <pre data-prefix="3" className="text-info"><code>## Generated on ...</code></pre>
        <pre data-prefix="4" className="text-info"><code>##</code></pre>
        <pre data-prefix="5"><code></code></pre>
        <pre data-prefix="6"><code>Server = http://ftp.io.kr/<b>$repo/os/$arch</b></code> <code className="text-info"># or..</code></pre>
        <pre data-prefix="7"><code>Server = https://ftp.io.kr/<b>$repo/os/$arch</b></code></pre>
        <pre data-prefix="8"><code></code></pre>
      </div>
    </div >
  )
}

export default About