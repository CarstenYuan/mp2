import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchAllPokemon } from '../api/pokeapi'
import type { Pokemon } from '../types/pokemon'
import { PokemonContext } from './PokemonContext'

export default function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchAllPokemon()
      .then((data) => {
        if (!cancelled) setPokemon(data)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load Pokémon from PokeAPI. Please try again.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo(
    () => ({ pokemon, loading, error, reload }),
    [pokemon, loading, error, reload],
  )

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
}
