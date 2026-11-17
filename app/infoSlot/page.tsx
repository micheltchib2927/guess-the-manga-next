"use client"
import {useState} from 'react'
import styles from "./infoSlot.module.css"

type slotPropsTypes = {
    label : string,
    info : string,
    value : number,
    decrementation : (n : number) => void
}

export default function InfoSlot ({ label, info, value, decrementation} : slotPropsTypes) {
    const [revealed, setRevealed] = useState(false);

    function reveal(){
        if(!revealed){
            setRevealed(true);
            decrementation(value);
        }
    }
    
    return(<div style = {{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <h3>{label}</h3>
        <div className = {`${styles.infoSlot} ${revealed ? styles.revealedSlot : ""}`} onClick = {reveal}>
            <h3 className = {`${label === "Auteur(es)" || "Studio(s)" ? styles.authorText : ""} ${label === "Genres" ? styles.genreText : ""}`}>{revealed ? info : `-${value} points`}</h3>
        </div>
    </div>)
}