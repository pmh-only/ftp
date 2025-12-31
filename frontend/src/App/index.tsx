import { useAtomValue } from 'jotai'
import About from '../About'
import FileLister from '../FileLister'
import Hero from '../Hero'
import { tabState } from '../state'
import './style.css'

function App() {
  const tab = useAtomValue(tabState)

  return (
    <div className="w-dvw h-dvh flex justify-center">
      <div className="flex w-full max-w-400 flex-col p-6 md:flex-row gap-6">
        <Hero className="" />

        {tab === 'ABOUT' && (
          <div className="flex-1 flex grow relative overflow-y-auto gap-4 px-2 scroll-smooth">
            <About className="flex-1" />
            <FileLister className="sticky top-0 flex-1 flex-col lg:flex hidden bg-base-200 p-6 rounded-2xl" />
          </div>
        )}
        {tab === 'DIR_EXPLORER' && (
          <FileLister className="flex-1 grow flex flex-col" />
        )}
      </div>
    </div>
  )
}

export default App
