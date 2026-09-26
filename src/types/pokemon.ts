export interface PokemonStat {
  name: string
  value: number
}

export interface Pokemon {
  id: number
  name: string
  image: string
  sprite: string
  types: string[]
  /** decimetres, as returned by PokeAPI */
  height: number
  /** hectograms, as returned by PokeAPI */
  weight: number
  baseExperience: number
  abilities: string[]
  stats: PokemonStat[]
}
