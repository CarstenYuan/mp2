import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PokemonProvider from './context/PokemonProvider'
import DetailPage from './pages/DetailPage'
import GalleryPage from './pages/GalleryPage'
import ListPage from './pages/ListPage'

function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/">Back to the list</Link>
    </div>
  )
}

export default function App() {
  return (
    <PokemonProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ListPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="pokemon/:id" element={<DetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </PokemonProvider>
  )
}
