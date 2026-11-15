"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'
import styles from "./gameBlock.module.css"
import InfoSlot from "../infoSlot/page"

export default function GameBlock() {

    const score = useRef(100);
    const attemptsNumber = useRef(0);
    const answer = useRef("Masashi Kishimoto")
    const [userAnswer, setUserAnswer] = useState("")
    const [chikaUrl, setChikaUrl] = useState("/idle-chika.png")
    const [imageUrl, setImageUrl] = useState("/mystery-box.png")

    const [attemptsMessage, setAttemptsMessage] = useState("Encore 3 essais");
    const [attemptsLeft, setAttemptsLeft] = useState(true);

    function decrement(value : number){
        score.current -= value;
    }

    function handleAnswer(e: React.ChangeEvent<HTMLInputElement>){
        setUserAnswer(e.target.value);
    }

    function verifyAnswer(e: React.SubmitEvent<HTMLFormElement>) : void{
        e.preventDefault();
        console.log("bla");
        if(userAnswer.trim() === ""){
            return;
        }
        else if(userAnswer.toLowerCase() === answer.current.toLowerCase()){
            setAttemptsMessage(`Bien joué ! C'était bien ${answer.current}\nVous remportez ${score.current} points`)
            setAttemptsLeft(false);
        }
        else{
            attemptsNumber.current++;
            if(attemptsNumber.current === 3){
                setAttemptsMessage("Vous avez perdu !");
                setAttemptsLeft(false);
                setChikaUrl("/defeat-chika.png");
            }
            else{
                setAttemptsMessage(`Plus que ${3-attemptsNumber.current} tentatives !`)
            }
        }
    }

    return(<div className = {styles.gameBlock}>
        <Image
            src = {chikaUrl}
            width = {100}
            height = {100}
            alt = "idle"
        />
        <Image
            src = {imageUrl}
            width = {200}
            height = {200}
            alt = "mystery"
        />
        <div className = {styles.slotSection}>
            <InfoSlot label="Auteur" info="Masashi Kishimoto" value = {40} decrementation={decrement}/>
            <InfoSlot label="Durée" info="2000-2016" value = {20} decrementation={decrement}/>
            <InfoSlot label="Type" info="Shonen" value = {10} decrementation={decrement}/>
            <InfoSlot label="Volume" info="72 tomes" value = {20} decrementation={decrement}/>

            <form onSubmit = {verifyAnswer}>
                <input type="text" placeholder="Ce manga est..." className = {styles.userAnswer} value = {userAnswer} onChange = {(e) => handleAnswer(e)}/>
                <button disabled = {!attemptsLeft || userAnswer.trim() === ""}>Je tente !</button>
                <h5 className = {`${styles.attemptsMessage} ${attemptsNumber.current === 3 ? styles.failed : ""}`}>{attemptsMessage}</h5>
            </form>
        </div>
    </div>)
}