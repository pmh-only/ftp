function AboutQnA() {
  return (
    <div
      id="architecture"
      className="w-full mt-16 flex justify-center flex-col py-6 min-h-full"
    >
      <div className="flex flex-col gap-8 items-center">
        <h2 className="font-display italic text-4xl font-bold text-center ">
          Frequently Asked{' '}
          <span className="underline decoration-accent">Questions.</span>
        </h2>

        <div className="w-full max-w-2xl">
          <div className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title font-semibold">
              Okay, this thing is really over-engineered
            </div>
            <div className="collapse-content text-sm">
              I know — but most of this doesn't affect the basic mirror
              functionality. I was bored, so I built it this way.
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              What protocols does this mirror support?
            </div>
            <div className="collapse-content text-sm">
              This mirror supports HTTP, HTTPS (HTTP/2 and HTTP/3 via QUIC),
              FTP, rsync, and rsync over SSL.
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              What directory listing formats are supported?
            </div>
            <div className="collapse-content text-sm">
              The server supports both HTML and JSON directory listings. You can
              control the output format using the
              <code> Accept </code> request header.
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              Why does <code>curl ftp.io.kr</code> show unexpected output?
            </div>
            <div className="collapse-content text-sm">
              Because the domain starts with <code>ftp</code>, curl attempts the
              FTP protocol first. Although the FTP protocol still works, if you
              want HTML output, explicitly prefix the URL with
              <code> http://</code> or <code>https://</code>.
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              How do I use <code>rsync</code> with this mirror?
            </div>
            <div className="collapse-content text-sm">
              The mirror exposes an rsync module named <code>arch</code>. You
              can test it with:{' '}
              <code>rsync-ssl --list-only ftp.io.kr::arch</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutQnA
