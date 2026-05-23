import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BottomNav } from './BottomNav'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[26rem] bg-cream">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="px-4 pb-28 pt-5"
      >
        <Outlet />
      </motion.main>
      <BottomNav />
    </div>
  )
}
