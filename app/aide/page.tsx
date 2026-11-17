import Image from 'next/image'
import styles from "./helpPage.module.css"

export default function HelpPage (){
    return(<div className = {styles.helpPage}>
        <Image
            src = "/rules.png"
            width = "90"
            height = "90"
            alt = "question"
        />
        <div className = {styles.rules}>
            <h1>Comment jouer ?</h1>
            <h3>Le but du jeu est de trouver le titre d'une oeuvre avec le plus de points possible.
                Pour cela vous avez la possibilité de révéler plusieurs indices mais chaque indice révélé vous retire des points.
                Vous avez 3 tentatives et 110 points à gagner. À vous de jouer !
            </h3>
        </div>
        <div className = {styles.notesSection}>
            <h5>Notes</h5>
            <ul>
                <li>Les animés et mangas recherchés sont tous dans le top 100 MyAnimeList</li>
                <li>Pour les animés dont certanes saisons sont considérées comme des animés différents sur le site, le titre de la saison 1 passe.</li>
            </ul>
        </div>
    </div>)
}