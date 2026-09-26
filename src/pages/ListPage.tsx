import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage, Loading } from '../components/Status'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../context/PokemonContext'
import {
  formatHeight,
  formatId,
  formatName,
  formatWeight,
} from '../utils/format'
import { SORT_OPTIONS, getStat, sortPokemon } from '../utils/sort'
import type { SortKey, SortOrder } from '../utils/sort'
import styles from './ListPage.module.css'

export default function ListPage() {
  const { pokemon, loading, error, reload } = usePokemon()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [order, setOrder] = useState<SortOrder>('asc')

  const results = useMemo(() => {
    const term = query.trim().toLowerCase().replace(/^#/, '')
    const matches = term
      ? pokemon.filter(
          (p) =>
            p.name.includes(term) ||
            String(p.id) === term ||
            formatId(p.id).slice(1) === term,
        )
      : pokemon
    return sortPokemon(matches, sortKey, order)
  }, [pokemon, query, sortKey, order])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section>
      <h1 className={styles.title}>Pokémon list</h1>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span className={styles.label}>Search</span>
          <input
            type="search"
            className={styles.input}
            placeholder="Search by name or number…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Sort by</span>
          <select
            className={styles.input}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.field}>
          <span className={styles.label}>Order</span>
          <div className={styles.toggle} role="group" aria-label="Sort order">
            <button
              type="button"
              className={order === 'asc' ? styles.toggleOn : styles.toggleOff}
              aria-pressed={order === 'asc'}
              onClick={() => setOrder('asc')}
            >
              ↑ Ascending
            </button>
            <button
              type="button"
              className={order === 'desc' ? styles.toggleOn : styles.toggleOff}
              aria-pressed={order === 'desc'}
              onClick={() => setOrder('desc')}
            >
              ↓ Descending
            </button>
          </div>
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {results.length} of {pokemon.length} Pokémon
      </p>

      {results.length === 0 ? (
        <p className={styles.empty}>No Pokémon match “{query}”.</p>
      ) : (
        <ul className={styles.list}>
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} className={styles.row}>
                <img
                  src={p.sprite}
                  alt=""
                  className={styles.sprite}
                  loading="lazy"
                />
                <span className={styles.id}>{formatId(p.id)}</span>
                <span className={styles.name}>{formatName(p.name)}</span>
                <span className={styles.types}>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </span>
                <span className={styles.stats}>
                  <span>{formatHeight(p.height)}</span>
                  <span>{formatWeight(p.weight)}</span>
                  <span>HP {getStat(p, 'hp')}</span>
                  <span>ATK {getStat(p, 'attack')}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
