'use client'
import React, { useState } from 'react'
import { addExercise } from '../lib/storage'
import { MUSCLE_TAGS } from '../lib/types'

export default function ExerciseForm() {
  const [name, setName] = useState('')
  const [tag, setTag] = useState('Bein')
  const canSave = name.trim().length > 0
  return (
    <form
      onSubmit={async (e: React.FormEvent) => { e.preventDefault(); if (!canSave) return; await addExercise({ name: name.trim(), muscleTag: tag as any }); setName('') }}
      className="rounded-2xl border border-base-200 bg-base-white p-4 shadow-sm"
    >
      <div className="mb-3">
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Übung</label>
  <input id="name" placeholder="z. B. Kniebeugen" className="w-full rounded-xl border border-base-300 bg-base-50 px-3 py-2 text-base-900 placeholder-base-500 focus-visible:ring-base-700" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} inputMode="text" autoComplete="off" />
      </div>
      <div className="mb-4">
        <label htmlFor="muskel" className="mb-1 block text-sm font-medium">Muskel-Tag</label>
        <select id="muskel" className="w-full rounded-xl border border-base-300 bg-base-50 px-3 py-2" value={tag} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTag(e.target.value)}>
          {MUSCLE_TAGS.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
      </div>
      <button type="submit" disabled={!canSave} className="button-press inline-flex w-full items-center justify-center rounded-xl bg-base-900 px-4 py-2 text-base-white disabled:opacity-40" aria-disabled={!canSave}>Hinzufügen</button>
    </form>
  )
}