export const MUSCLE_TAGS = ['Bein', 'Arm', 'Rücken', 'Brust', 'Schulter', 'Rumpf'] as const
export type MuscleTag = typeof MUSCLE_TAGS[number]
export type Exercise = { id: string; name: string; muscleTag: MuscleTag; createdAt: number }
export type SetEntry = { id: string; exerciseId: string; weightText: string; repsText: string; performedAt: number }