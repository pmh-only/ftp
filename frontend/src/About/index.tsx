interface Props {
  className?: string
}

function About({ className }: Props) {
  return (
    <div className={className + ' overflow-y-auto p-2 flex gap-6'}>
      <div className="flex flex-col-reverse lg:flex-row gap-6">
        <div className="grow flex-1 bg-base-300 rounded-2xl p-6 text-sm font-light">
          <h2 className="text-lg font-normal">Welcome aboard!</h2>
          <p>This website, <a href="#">ftp.io.kr</a> serves the public package mirror server for <a href="https://archlinux.org/" target="_blank">Arch Linux</a>, a lightweight and flexible Linux® distribution that tries to Keep It Simple.</p>
        </div>

        <div
          className="grow flex-1 hero bg-base-300 rounded-2xl lg:max-w-xl"
          style={{ backgroundImage: 'url(/_assets/aboutbg.webp)' }}>
          <div className="flex flex-col justify-end items-start p-6 pb-8 w-full h-64 gap-2 italic">
            <h1 className="font-bold italic font-display text-6xl">
              <span className="font-thin">ftp</span>.io.kr.
            </h1>
          </div>
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