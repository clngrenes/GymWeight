import { openDB } from 'idb'
import type { Exercise, SetEntry, MuscleTag } from './types'

let dbPromise: Promise<any> | null = null
export function ensureDb() {
  if (!dbPromise) {
    dbPromise = openDB('gymweight-db', 1, { upgrade(db) { const ex = db.createObjectStore('exercises', { keyPath: 'id' }); ex.createIndex('by_name', 'name', { unique: false }); const sets = db.createObjectStore('sets', { keyPath: 'id' }); sets.createIndex('by_exercise', 'exerciseId', { unique: false }); db.createObjectStore('checks', { keyPath: 'id' }) } })
  }
  return dbPromise
}
function uuid() { return crypto.randomUUID() }
export async function addExercise({ name, muscleTag }: { name: string; muscleTag: MuscleTag }) { const db = await ensureDb(); const ex: Exercise = { id: uuid(), name, muscleTag, createdAt: Date.now() }; await db.add('exercises', ex); return ex }
export async function getExercises(): Promise<Exercise[]> { const db = await ensureDb(); const all = await db.getAll('exercises'); return all.sort((a, b) => b.createdAt - a.createdAt) }
export async function upsertSet(exerciseId: string, weightText: string, repsText: string) { const db = await ensureDb(); const set: SetEntry = { id: uuid(), exerciseId, weightText, repsText, performedAt: Date.now() }; await db.put('sets', set); return set }
export async function getLastSetForExercise(exerciseId: string) { const db = await ensureDb(); const all = await db.getAllFromIndex('sets', 'by_exercise'); const list = all.filter(s => s.exerciseId === exerciseId).sort((a,b) => b.performedAt - a.performedAt); return list[0] ? { weightText: list[0].weightText, repsText: list[0].repsText } : null }
function startOfTodayLocal(): number { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() }
export async function toggleTodayDone(exerciseId: string, done: boolean) { const db = await ensureDb(); if (done) { await db.put('checks', { id: exerciseId, ts: Date.now() }) } else { await db.delete('checks', exerciseId) } }
export async function getTodayCompletionMap(): Promise<Record<string, boolean>> { const db = await ensureDb(); const all = await db.getAll('checks'); const todayStart = startOfTodayLocal(); const map: Record<string, boolean> = {}; for (const c of all) { if (c.ts < todayStart) { await db.delete('checks', c.id) } else { map[c.id] = true } } return map }