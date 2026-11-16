import styles from "./manga.module.css"
import Image from 'next/image'
import MangaGameBlock from '../mangaGameBlock/page'

export default function Manga() {
    return(<div className = {styles.mangaPage}>
        <MangaGameBlock/>
    </div>)
}