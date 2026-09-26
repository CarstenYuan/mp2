import type { Pokemon } from '../types/pokemon'

export type SortKey =
  | 'id'
  | 'name'
  | 'height'
  | 'weight'
  | 'baseExperience'
  | 'hp'
  | 'attack'

export type SortOrder = 'asc' | 'desc'

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'id', label: 'Number' },
  { key: 'name', label: 'Name' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'baseExperience', label: 'Base experience' },
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
]

export function getStat(pokemon: Pokemon, name: string): number {
  return pokemon.stats.find((s) => s.name === name)?.value ?? 0
}

function getSortValue(pokemon: Pokemon, key: SortKey): string | number {
  switch (key) {
    case 'hp':
    case 'attack':
      return getStat(pokemon, key)
    default:
      return pokemon[key]
  }
}

export function sortPokemon(
  list: Pokemon[],
  key: SortKey,
  order: SortOrder,
): Pokemon[] {
  const direction = order === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    const left = getSortValue(a, key)
    const right = getSortValue(b, key)
    const result =
      typeof left === 'string' && typeof right === 'string'
        ? left.localeCompare(right)
        : Number(left) - Number(right)
    // Fall back to the Pokedex number so ties have a stable, predictable order.
    return (result || a.id - b.id) * direction
  })
}
