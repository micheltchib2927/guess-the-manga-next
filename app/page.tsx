import TopBar from './topBar/page'
import styles from './accueil.module.css'
import Link from 'next/link'

export default function Home() {

  return (<>
    <TopBar/>
    <div className = {styles.presentation}>
      <h2>Bienvenue sur</h2>
      <h1>GuessTheManga</h1>
    </div>
    <div className = {styles.categories}>
      <Link href = "/" className = {styles.category} id = {styles.manga}>Trouver un Manga</Link>
      <Link href = "/" className = {styles.category} id = {styles.anime}>Trouver un Anime</Link>
      <Link href = "/" className = {styles.category} id = {styles.auteur}>Trouver un Auteur</Link>
    </div>
  </>);
}
