import FileLister from '../FileLister'
import Hero from '../Hero'
import './style.css'

function App() {
  return (
    <div className="w-dvw h-dvh flex justify-center">
      <div className="flex w-full max-w-6xl flex-col p-6 md:flex-row gap-6">
        <Hero className="" />
        <FileLister className="flex-1 grow flex flex-col" />
      </div>
    </div>
  )
}

export default App
