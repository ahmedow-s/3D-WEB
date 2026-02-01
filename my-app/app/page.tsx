import ThreeScene from '@/shared/ThreeScene'

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      
      <ThreeScene />

      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold">
          Hi, I’m <span className="text-yellow-400">MuhammadAziz</span>
        </h1>

        <p className="mt-4 text-lg md:text-2xl text-gray-300">
          Frontend Developer • Three.js • Creative Web
        </p>

        <div className="mt-8 flex gap-4">
          <button className="pointer-events-auto px-6 py-3 bg-yellow-400 text-black rounded-xl">
            View Projects
          </button>
          <button className="pointer-events-auto px-6 py-3 border border-white/30 rounded-xl">
            Contact
          </button>
        </div>
      </div>

    </main>
  )
}
