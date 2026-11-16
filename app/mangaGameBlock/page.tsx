"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'
import styles from "./mangaGameBlock.module.css"
import InfoSlot from "../infoSlot/page"

type answerTyping = {
    primaryTitle: string,
    possibleTitles: string[],
    author: string,
    duration: string,
    numVolumes: string,
    genres: string,
    pictureUrl: string
}

type authorObject = {
    node: {
        id: number,
        first_name: string,
        last_name: string
    },
    role: string
}

type genreObject = {
    id: number,
    name: string
}

type dataToGetTyping = {
    id: number,
    title: string,
    main_picture: {
        medium: string,
        large: string
    },
    alternative_titles: {
        en: string,
        ja: string
    },
    start_date: string,
    end_date: string,
    authors: authorObject[],
    num_volumes: number,
    genres: genreObject[],
}

export default function MangaGameBlock() {

    const score = useRef(100);
    const attemptsNumber = useRef(0);
    const [answer, setAnswer] = useState<answerTyping>({primaryTitle: "", possibleTitles: [""], author: "", duration: "", numVolumes: "", genres: "", pictureUrl: ""})
    const [userAnswer, setUserAnswer] = useState("")
    const [chikaUrl, setChikaUrl] = useState("/idle-chika.png")
    const [imageUrl, setImageUrl] = useState("/mystery-box.png")

    const [attemptsMessage, setAttemptsMessage] = useState("Encore 3 essais");
    const [attemptsLeft, setAttemptsLeft] = useState(true);

    function sliceString(str : string, character : string) : string{
        const n = str.indexOf(character);
        return n === -1 ? str : str.slice(0, n);
    }

    useEffect(() => {
        async function getData(){
            try{
                const res = await fetch("/api/manga?q=145");
                const data : dataToGetTyping = await res.json();
                console.log(data);

                setAnswer({
                    primaryTitle: data.title,

                    possibleTitles: [data.title.toLowerCase(), data.alternative_titles.en.toLowerCase(), data.alternative_titles.ja.toLowerCase()],

                    author: data.authors.length === 1 ? 
                    data.authors[0].node.first_name.toLowerCase() + " " + data.authors[0].node.last_name.toLowerCase()
                    : data.authors[0].node.first_name.toLowerCase() + " " + data.authors[0].node.last_name.toLowerCase() + " & " + data.authors[1].node.first_name.toLowerCase() + " " + data.authors[1].node.last_name.toLowerCase(),

                    duration: `${sliceString(data.start_date, '-')} - ${sliceString(data.end_date, '-')}`,

                    numVolumes: `${data.num_volumes}`,

                    genres: `${data.genres[0].name}/${data.genres[1].name}/${data.genres[2].name}/${data.genres[3].name}/${data.genres[4].name}`,

                    pictureUrl: data.main_picture.medium

                })
            }
            catch(e){
                console.log(e);
            }
        }
        getData()
    }, [])

    function decrement(value : number){
        score.current -= value;
    }

    function handleAnswer(e: React.ChangeEvent<HTMLInputElement>){
        setUserAnswer(e.target.value);
    }

    function verifyAnswer(e: React.SubmitEvent<HTMLFormElement>) : void{
        e.preventDefault();
        if(userAnswer.trim() === ""){
            return;
        }
        else if(answer.possibleTitles.includes(userAnswer.toLowerCase())){
            setImageUrl(answer.pictureUrl);
            setAttemptsMessage(`Bien joué ! C'était bien ${answer.primaryTitle}\nVous remportez ${score.current} points`)
            setAttemptsLeft(false);
        }
        else{
            attemptsNumber.current++;
            if(attemptsNumber.current === 3){
                setAttemptsMessage("Vous avez perdu !\nLa réponse était : " + answer.primaryTitle);
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
            className = {styles.mysteryBox}
        />
        <div className = {styles.slotSection}>
            <InfoSlot label="Auteur(es)" info={answer.author} value = {40} decrementation={decrement}/>
            <InfoSlot label="Durée" info={answer.duration} value = {20} decrementation={decrement}/>
            <InfoSlot label="Genres" info={answer.genres} value = {10} decrementation={decrement}/>
            <InfoSlot label="Volume" info={answer.numVolumes} value = {20} decrementation={decrement}/>

            <form onSubmit = {verifyAnswer}>
                <input type="text" placeholder="Ce manga est..." className = {styles.userAnswer} value = {userAnswer} onChange = {(e) => handleAnswer(e)}/>
                <button disabled = {!attemptsLeft || userAnswer.trim() === ""}>Je tente !</button>
                <h5 className = {`${styles.attemptsMessage} ${attemptsNumber.current === 3 ? styles.failed : ""}`}>{attemptsMessage}</h5>
            </form>
        </div>
    </div>)
}