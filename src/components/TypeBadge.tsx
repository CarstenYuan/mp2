import { formatName } from '../utils/format'
import styles from './TypeBadge.module.css'

export default function TypeBadge({ type }: { type: string }) {
  const typeClass = styles[`type_${type}`] ?? ''
  return <span className={`${styles.badge} ${typeClass}`}>{formatName(type)}</span>
}
