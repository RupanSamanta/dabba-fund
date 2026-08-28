import { ArrowRight, LogIn, Sparkles, UserPlus, WalletCards } from "lucide-react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <main className="min-h-svh overflow-hidden bg-[#f8f3e8] text-[#251d17]">
      <section className="relative flex min-h-svh flex-col px-6 py-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#d8a03d]/25 blur-3xl" />
          <div className="absolute bottom-12 left-8 h-36 w-36 rounded-full bg-[#3f7f6f]/15 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-40 w-24 rounded-l-full bg-[#c8553d]/10 blur-2xl" />
        </div>

        <nav className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#251d17] text-[#fff8ec] shadow-lg shadow-[#251d17]/15">
              <WalletCards size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight">Dabba Fund</p>
              <p className="text-xs text-[#766754]">shared wallet</p>
            </div>
          </div>

          <Link
            to="/login"
            aria-label="Log in"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#e4d3b6] bg-white/70 text-[#46372b] shadow-sm backdrop-blur transition hover:border-[#b08238] hover:text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b08238]/30"
          >
            <LogIn size={18} />
          </Link>
        </nav>

        <div className="relative z-10 flex flex-1 flex-col justify-center pb-6 pt-10">
          <div className="mx-auto mb-8 w-full max-w-[22rem]">
            <div className="relative mx-auto aspect-[1.12] max-w-[18rem]">
              <div className="absolute inset-x-8 bottom-1 h-8 rounded-full bg-[#3f2d1f]/15 blur-xl" />
              <div className="absolute left-1/2 top-4 h-52 w-52 -translate-x-1/2 rounded-[2rem] bg-[#e6c37b] shadow-2xl shadow-[#7c4f18]/15 rotate-6" />
              <div className="absolute left-1/2 top-8 h-52 w-52 -translate-x-1/2 rounded-[2rem] border border-white/50 bg-[#fff8ec] shadow-xl -rotate-3">
                <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                  <div>
                    <div className="h-2 w-14 rounded-full bg-[#251d17]" />
                    <div className="mt-2 h-2 w-20 rounded-full bg-[#dfcfb6]" />
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#3f7f6f] text-white">
                    <Sparkles size={18} />
                  </div>
                </div>

                <div className="absolute left-5 right-5 top-24 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#f3e7d4] px-4 py-3">
                    <span className="h-2 w-16 rounded-full bg-[#9d8b73]" />
                    <span className="h-2 w-10 rounded-full bg-[#36800f]" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#f3e7d4] px-4 py-3">
                    <span className="h-2 w-20 rounded-full bg-[#9d8b73]" />
                    <span className="h-2 w-12 rounded-full bg-[#b08238]" />
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#251d17] px-4 py-4 text-left text-[#fff8ec]">
                  <p className="text-xs text-[#d7c6a9]">Total fund</p>
                  <p className="mt-1 text-3xl font-bold tracking-normal">₹50</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-sm text-center">
            <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#e3d2b7] bg-white/65 px-3 py-1.5 text-xs font-medium text-[#6c5a46] shadow-sm backdrop-blur">
              <Sparkles size={14} />
              Contributions, purchases, and balance in one place
            </p>
            <h1 className="text-4xl font-black leading-[1.02] tracking-normal text-[#1d1712]">
              Keep the group fund beautifully simple.
            </h1>
            <p className="mx-auto mt-4 max-w-xs text-base leading-7 text-[#665747]">
              Log in to continue managing your dabba fund, or create an account to join the pool.
            </p>
          </div>

          <div className="mx-auto mt-9 grid w-full max-w-sm gap-3">
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#251d17] px-5 text-sm font-semibold text-[#fff8ec] shadow-lg shadow-[#251d17]/15 transition hover:bg-[#3a2a20] focus:outline-none focus:ring-2 focus:ring-[#251d17]/25"
            >
              <LogIn size={18} />
              Log in
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d8c7ad] bg-white/75 px-5 text-sm font-semibold text-[#2c2825] shadow-sm backdrop-blur transition hover:border-[#b08238] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#b08238]/25"
            >
              <UserPlus size={18} />
              Sign up
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
