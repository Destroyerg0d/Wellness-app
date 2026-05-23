import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from './lib/store'
import { LockScreen } from './components/LockScreen'
import Layout from './components/Layout'
import Onboarding from './screens/Onboarding'
import Today from './screens/Today'
import Workout from './screens/Workout'
import Library from './screens/Library'
import ExerciseDetail from './screens/ExerciseDetail'
import SessionPlayer from './screens/SessionPlayer'
import Food from './screens/Food'
import Progress from './screens/Progress'
import Settings from './screens/Settings'

export default function App() {
  const { state } = useStore()
  const [locked, setLocked] = useState(() => sessionStorage.getItem('sw-unlocked') !== '1')

  if (locked) {
    return (
      <LockScreen
        onUnlock={() => {
          sessionStorage.setItem('sw-unlocked', '1')
          setLocked(false)
        }}
      />
    )
  }

  if (!state.onboardingComplete) {
    return <Onboarding />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Today />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/library" element={<Library />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/food" element={<Food />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/workout/session" element={<SessionPlayer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
