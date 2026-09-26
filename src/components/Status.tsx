import styles from './Status.module.css'

export function Loading() {
  return (
    <div className={styles.status} role="status">
      <div className={styles.spinner} aria-hidden="true" />
      <p>Loading Pokémon…</p>
    </div>
  )
}

export function ErrorMessage({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className={styles.status} role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
