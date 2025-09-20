'use client'
import ExerciseForm from '../components/ExerciseForm'
import ExerciseList from '../components/ExerciseList'
import { useEffect, useState } from 'react'
import { ensureDb } from '../lib/storage'

export default function Home() {
  const [ready, setReady] = useState(false)
  useEffect(() => { ensureDb().then(() => setReady(true)) }, [])
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">GymWeight</h1>
        <p className="text-base-600 mt-1 text-sm">Übungen, Gewicht & Wdh. loggen. Offline.</p>
      </header>
      <section className="mb-6"><ExerciseForm /></section>
      <section aria-label="Übungen Liste">{ready ? <ExerciseList /> : <p className="text-base-500">Lade…</p>}</section>
      <footer className="mt-10 text-center text-xs text-base-500">Manrope • Graustufen • PWA</footer>
    </main>
  )
}