import './App.css'
import IndexView from "./IndexView"

function App() {
  return (
    <main className="main">
      <div className="logo">
        <a href="/"><h1><span>ftp.</span>io.kr.</h1></a>
        <div>
          <p>The</p>
          <p>Arch linux package mirror.</p>
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
          <p>High Availablity.</p>
          <p>HTTP/3, 0-RTT.</p>
          <p>No ip logging.</p>
          <p>No HTTPs redirection.</p>
          <p>Rsync Support.</p>
        </div>
        <div>
          <p>And</p>
          <p>Zero-downtime</p>
          <p>Maintenances w. k8s.</p>
        </div>
        <div>
          <p>Here is</p>
          <p><a href="https://github.com/pmh-only/ftp/tree/main/infra" target="_blank">Infrastructure Code.</a></p>
          <p><a href="https://github.com/pmh-only/ftp/tree/main/indexer" target="_blank">Index Page Source.</a></p>
          <p><a href="https://github.com/pmh-only/ftp/tree/main/syncrepo" target="_blank">Mirroring Daemon Source.</a></p>
          <p><a href="https://github.com/pmh-only/ftp/tree/main/webserver" target="_blank">NGINX Config.</a></p>
        </div>
        <div>
          <p>Contact</p>
          <p><a href="https://github.com/pmh-only/ftp/issues" target="_blank">GitHub Issue Tracker.</a></p>
          <p><a href="mailto:pmh_only@pmh.codes" target="_blank">Direct Email.</a></p>
          <p>or Discord (@pmh_only)</p>
        </div>
      </div>
      <div className="index_view">
        <IndexView />
      </div>
    </main>
  )
}


export default App
