import './Hero.css'

function Hero() {
  return (
    <div className="hero">
      <a href="/"><h1><span>ftp.</span>io.kr.</h1></a>

      <div>
        <p>The</p>
        <p>Arch Linux package mirror.</p>
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
        <p>With</p>
        <p>High availability.</p>
        <p>HTTP/3, 0-RTT.</p>
        <p>No IP logging.</p>
        <p>No HTTPS redirection.</p>
        <p>Rsync support.</p>
      </div>

      <div>
        <p>And</p>
        <p>Zero-downtime</p>
        <p>Maintenance with k8s.</p>
      </div>

      <div>
        <p>Here is</p>
        <p><a href="https://github.com/pmh-only/ftp/tree/main/infra" target="_blank">Infrastructure code.</a></p>
        <p><a href="https://github.com/pmh-only/ftp/tree/main/indexer" target="_blank">Index page source.</a></p>
        <p><a href="https://github.com/pmh-only/ftp/tree/main/syncrepo" target="_blank">Mirroring daemon source.</a></p>
        <p><a href="https://github.com/pmh-only/ftp/tree/main/webserver" target="_blank">NGINX config.</a></p>
      </div>

      <div>
        <p>Contact</p>
        <p><a href="https://github.com/pmh-only/ftp/issues" target="_blank">GitHub issue tracker.</a></p>
        <p><a href="mailto:pmh_only@pmh.codes" target="_blank">Direct email.</a></p>
        <p>or Discord (@pmh_only)</p>
      </div>
    </div>
  )
}

export default Hero