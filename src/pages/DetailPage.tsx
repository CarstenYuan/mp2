import { Link, useParams } from 'react-router-dom'
import { ErrorMessage, Loading } from '../components/Status'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../context/PokemonContext'
import {
  formatHeight,
  formatId,
  formatName,
  formatWeight,
} from '../utils/format'
import styles from './DetailPage.module.css'

const MAX_STAT = 255

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const { pokemon, loading, error, reload } = usePokemon()

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const index = pokemon.findIndex((p) => String(p.id) === id)
  if (index === -1) {
    return (
      <div className={styles.notFound}>
        <h1>Pokémon not found</h1>
        <p>There is no Pokémon with the number “{id}”.</p>
        <Link to="/">Back to the list</Link>
      </div>
    )
  }

  const current = pokemon[index]
  // Wrap around so the buttons always work, even at either end of the list.
  const previous = pokemon[(index - 1 + pokemon.length) % pokemon.length]
  const next = pokemon[(index + 1) % pokemon.length]

  return (
    <article className={styles.stage}>
      <Link
        to={`/pokemon/${previous.id}`}
        className={`${styles.arrow} ${styles.arrowPrev}`}
        aria-label={`Previous: ${formatName(previous.name)}`}
        title={`Previous: ${formatName(previous.name)}`}
      >
        ←
      </Link>

      <div className={styles.card}>
        <div className={styles.hero}>
          <img
            src={current.image}
            alt={formatName(current.name)}
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <p className={styles.id}>{formatId(current.id)}</p>
          <h1 className={styles.name}>{formatName(current.name)}</h1>
          <div className={styles.types}>
            {current.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>Height</dt>
              <dd>{formatHeight(current.height)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatWeight(current.weight)}</dd>
            </div>
            <div>
              <dt>Base experience</dt>
              <dd>{current.baseExperience}</dd>
            </div>
            <div>
              <dt>Abilities</dt>
              <dd>{current.abilities.map(formatName).join(', ')}</dd>
            </div>
          </dl>

          <h2 className={styles.heading}>Base stats</h2>
          <ul className={styles.stats}>
            {current.stats.map((stat) => (
              <li key={stat.name} className={styles.stat}>
                <span className={styles.statName}>{formatName(stat.name)}</span>
                <span className={styles.statValue}>{stat.value}</span>
                <progress
                  className={styles.bar}
                  max={MAX_STAT}
                  value={stat.value}
                  aria-label={`${formatName(stat.name)}: ${stat.value}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        to={`/pokemon/${next.id}`}
        className={`${styles.arrow} ${styles.arrowNext}`}
        aria-label={`Next: ${formatName(next.name)}`}
        title={`Next: ${formatName(next.name)}`}
      >
        →
      </Link>
    </article>
  )
}
