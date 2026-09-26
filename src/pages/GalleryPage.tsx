import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage, Loading } from '../components/Status'
import { usePokemon } from '../context/PokemonContext'
import { formatId, formatName } from '../utils/format'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const { pokemon, loading, error, reload } = usePokemon()
  const [selected, setSelected] = useState<string[]>([])

  const allTypes = useMemo(
    () => [...new Set(pokemon.flatMap((p) => p.types))].sort(),
    [pokemon],
  )

  const results = useMemo(
    () =>
      selected.length === 0
        ? pokemon
        : pokemon.filter((p) => p.types.some((t) => selected.includes(t))),
    [pokemon, selected],
  )

  function toggleType(type: string) {
    setSelected((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type],
    )
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section>
      <h1 className={styles.title}>Gallery</h1>

      <div className={styles.filters}>
        <div className={styles.filterHeader}>
          <span className={styles.label}>Filter by type</span>
          {selected.length > 0 && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => setSelected([])}
            >
              Clear filters
            </button>
          )}
        </div>
        <div className={styles.chips} role="group" aria-label="Filter by type">
          {allTypes.map((type) => {
            const active = selected.includes(type)
            return (
              <button
                key={type}
                type="button"
                className={active ? styles.chipOn : styles.chip}
                aria-pressed={active}
                onClick={() => toggleType(type)}
              >
                {formatName(type)}
              </button>
            )
          })}
        </div>
        <p className={styles.hint}>
          {selected.length === 0
            ? 'Select one or more types to narrow the gallery.'
            : 'Showing Pokémon that have any of the selected types.'}
        </p>
      </div>

      <p className={styles.count} aria-live="polite">
        {results.length} of {pokemon.length} Pokémon
      </p>

      <ul className={styles.grid}>
        {results.map((p) => (
          <li key={p.id}>
            <Link to={`/pokemon/${p.id}`} className={styles.card}>
              <img
                src={p.image}
                alt={formatName(p.name)}
                className={styles.image}
                loading="lazy"
              />
              <span className={styles.id}>{formatId(p.id)}</span>
              <span className={styles.name}>{formatName(p.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
