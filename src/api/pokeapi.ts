import axios from 'axios'
import type { Pokemon } from '../types/pokemon'

export const POKEMON_COUNT = 151
const CACHE_KEY = 'pokedex-cache-v1'

const client = axios.create({ baseURL: 'https://pokeapi.co/api/v2' })

interface RawPokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
}

function toPokemon(raw: RawPokemon): Pokemon {
  const sprite = raw.sprites.front_default ?? ''
  return {
    id: raw.id,
    name: raw.name,
    image: raw.sprites.other?.['official-artwork']?.front_default ?? sprite,
    sprite,
    types: raw.types.map((t) => t.type.name),
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience ?? 0,
    abilities: raw.abilities.map((a) => a.ability.name),
    stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  }
}

function readCache(): Pokemon[] | null {
  try {
    const stored = localStorage.getItem(CACHE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as Pokemon[]
    return Array.isArray(parsed) && parsed.length === POKEMON_COUNT
      ? parsed
      : null
  } catch {
    return null
  }
}

function writeCache(list: Pokemon[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list))
  } catch {
    // Storage may be full or disabled; caching is only an optimisation.
  }
}

let inflight: Promise<Pokemon[]> | null = null

/**
 * Loads the first generation of Pokemon. The result is cached in localStorage
 * (to avoid hammering PokeAPI) and de-duplicated while a request is in flight.
 */
export function fetchAllPokemon(): Promise<Pokemon[]> {
  if (inflight) return inflight

  const cached = readCache()
  if (cached) return Promise.resolve(cached)

  const ids = Array.from({ length: POKEMON_COUNT }, (_, i) => i + 1)
  inflight = Promise.all(
    ids.map((id) => client.get<RawPokemon>(`/pokemon/${id}`)),
  )
    .then((responses) => {
      const list = responses.map((res) => toPokemon(res.data))
      writeCache(list)
      return list
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}
