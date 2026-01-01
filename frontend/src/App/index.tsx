import { useAtomValue } from 'jotai'
import About from '../About'
import FileLister from '../FileLister'
import Hero from '../Hero'
import { tabState } from '../state'
import './style.css'

function App() {
  const tab = useAtomValue(tabState)

  return (
    <div className="w-dvw h-dvh flex justify-center overflow-hidden">
      <div className="flex w-full max-w-400 flex-col p-6 md:flex-row gap-6">
        <Hero className="" />

        {tab === 'ABOUT' && <About className="flex-1" />}
        {tab === 'DIR_EXPLORER' && (
          <FileLister className="grow flex flex-col" />
        )}
      </div>
    </div>
  )
}

export default App
