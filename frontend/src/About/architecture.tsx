function AboutArchitecture() {
  return (
    <div
      id="architecture"
      className="w-full min-h-full flex justify-center flex-col py-6"
    >
      <div className="flex flex-col gap-8">
        <h2 className="font-display italic text-4xl font-bold text-center">
          The <span className="underline decoration-accent">Architecture.</span>
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          <img src="/_assets/architecture.webp" className="w-full max-w-2xl" />
        </div>
      </div>
    </div>
  )
}

export default AboutArchitecture
