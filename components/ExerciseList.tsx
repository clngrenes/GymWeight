'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { getExercises, getTodayCompletionMap, upsertSet, getLastSetForExercise, toggleTodayDone } from '../lib/storage'
import type { Exercise } from '../lib/types'

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({})
  const [lastMap, setLastMap] = useState<Record<string, { weightText: string; repsText: string } | null>>({})

  async function refresh() {
    const list = await getExercises()
    setExercises(list)
    setDoneMap(await getTodayCompletionMap())
    const lastEntries: Record<string, any> = {}
    for (const ex of list) lastEntries[ex.id] = await getLastSetForExercise(ex.id)
    setLastMap(lastEntries)
  }

  useEffect(() => { refresh() }, [])

  return (
    <div className="space-y-3">
      {exercises.length === 0 && (<p className="text-base-600">Noch keine Übungen. Lege oben eine an.</p>)}
      {exercises.map((ex) => (
        <ExerciseRow
          key={ex.id}
          ex={ex}
          done={!!doneMap[ex.id]}
          last={lastMap[ex.id]}
          onChange={() => { void refresh() }}
        />
      ))}
    </div>
  )
}

const ExerciseRow: React.FC<{ ex: Exercise; done: boolean; last: { weightText: string; repsText: string } | null; onChange: () => void }> = ({ ex, done, last, onChange }) => {
  const [weight, setWeight] = useState<string>('')
  const [reps, setReps] = useState<string>('')
  const placeholder = useMemo(() => ({ w: last?.weightText ? `Letztes Mal: ${last.weightText}` : '', r: last?.repsText ? `Letztes Mal: ${last.repsText}` : '' }), [last])
  return (
    <div className="rounded-2xl border border-base-200 bg-base-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span aria-hidden className={`inline-block h-4 w-4 rounded ${done ? 'bg-base-900' : 'bg-base-300'}`} />
          <h2 className="text-base font-medium">{ex.name}</h2>
        </div>
        <span className="text-xs text-base-600">{ex.muscleTag}</span>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <input className="rounded-xl border border-base-300 bg-base-50 px-3 py-2" placeholder={placeholder.w} value={weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} inputMode="text" aria-label="Gewicht (frei)" />
        <input className="rounded-xl border border-base-300 bg-base-50 px-3 py-2" placeholder={placeholder.r} value={reps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReps(e.target.value)} inputMode="text" aria-label="Wiederholungen (frei)" />
      </div>
      <div className="flex items-center gap-2">
        <button className="button-press inline-flex flex-1 items-center justify-center rounded-xl bg-base-900 px-3 py-2 text-base-white" onClick={async () => { if (!weight && !reps) return; await upsertSet(ex.id, weight, reps); await toggleTodayDone(ex.id, true); setWeight(''); setReps(''); onChange() }}>Speichern</button>
        <button className="rounded-xl border border-base-300 px-3 py-2 text-sm text-base-700" onClick={async () => { await toggleTodayDone(ex.id, !done); onChange() }} aria-pressed={done}>{done ? 'Check entfernen' : 'Als erledigt markieren'}</button>
      </div>
    </div>
  )
}