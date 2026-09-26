import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import BackToTop from './BackToTop'
import styles from './Layout.module.css'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}

export default function Layout() {
  const { pathname } = useLocation()

  // Start every page at the top, e.g. when opening a Pokémon from far down the list.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.ball} aria-hidden="true" />
            Pokédex
          </Link>
          <nav className={styles.nav} aria-label="Main">
            <NavLink to="/" end className={navClass}>
              List
            </NavLink>
            <NavLink to="/gallery" className={navClass}>
              Gallery
            </NavLink>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        Data from{' '}
        <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
          PokeAPI
        </a>
      </footer>
      <BackToTop />
    </div>
  )
}
