import styles from "./animePage.module.css"
import Image from 'next/image'
import AnimeGameBlock from '../animeGameBlock/page'

export default function Manga() {
    return(<div className = {styles.animePage}>
        <AnimeGameBlock/>
    </div>)
}