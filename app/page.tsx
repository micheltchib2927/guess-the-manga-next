import styles from './accueil.module.css'
import Link from 'next/link'

export default function Home() {

  return (<>
    <div className = {styles.presentation}>
      <h2>Bienvenue sur</h2>
      <h1>GuessTheManga</h1>
    </div>
    <div className = {styles.categories}>
      <Link href = "/manga" className = {styles.category} id = {styles.manga}>Trouver un Manga</Link>
      <Link href = "/anime" className = {styles.category} id = {styles.anime}>Trouver un Anime</Link>
      <Link href = "/aide" className = {styles.category} id = {styles.auteur}>Comment jouer ?</Link>
    </div>
  </>);
}
