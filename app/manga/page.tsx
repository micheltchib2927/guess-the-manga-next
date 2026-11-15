import styles from "./manga.module.css"
import Image from 'next/image'
import GameBlock from '../gameBlock/page'

export default function Manga() {
    return(<div className = {styles.mangaPage}>
        <GameBlock/>
    </div>)
}