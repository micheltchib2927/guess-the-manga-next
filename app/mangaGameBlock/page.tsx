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
    magazine: string,
    genres: string,
    pictureUrl: string
}

type serializationObject = {
    node: {
        id: number,
        name: string
    }
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

type mangaTyping = {
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
    genres: genreObject[],
    serialization: serializationObject[]
    
}

type listElement = {
    node: mangaTyping,
    ranking: {
        ranking: number
    }
}

type mangaListTyping = {
    data: listElement[]
}

export default function MangaGameBlock() {

    const score = useRef(100);
    const attemptsNumber = useRef(0);
    const [answer, setAnswer] = useState<answerTyping>({primaryTitle: "", possibleTitles: [""], author: "", duration: "", magazine: "", genres: "", pictureUrl: ""})
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
        const id = Math.floor(Math.random() * 100) + 1;
        async function getData(){
            try{
                const res = await fetch("/api/mangaList");
                const dataList : mangaListTyping = await res.json();
                console.log(dataList);

                const secondRes = await fetch(`/api/manga?q=${dataList.data[id].node.id}`)
                const data : mangaTyping = await secondRes.json();
                console.log(data);

                setAnswer({
                    primaryTitle: data.title,

                    possibleTitles: [data.title.toLowerCase(), data.alternative_titles.en.toLowerCase(), data.alternative_titles.ja.toLowerCase()],

                    author: data.authors.length === 1 ? 
                    data.authors[0].node.first_name + " " + data.authors[0].node.last_name
                    : data.authors[0].node.first_name + " " + data.authors[0].node.last_name + " & " + data.authors[1].node.first_name.toLowerCase() + " " + data.authors[1].node.last_name.toLowerCase(),

                    duration: `${sliceString(data.start_date, '-')} - ${data.end_date === undefined ? "En cours" : sliceString(data.end_date, '-')}`,

                    magazine: `${data.serialization[0].node.name}`,

                    genres: data.genres.map((genre: genreObject) => genre.name).join("/"),

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
            setChikaUrl("/victory-chika.png")
            setAttemptsLeft(false);
        }
        else{
            attemptsNumber.current++;
            if(attemptsNumber.current === 3){
                setImageUrl(answer.pictureUrl);
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
            className = {`${chikaUrl === "/victory-chika.png" ? styles.victoryChika : "" }`}
        />
        <Image
            src = {imageUrl}
            width = {200}
            height = {225}
            alt = "mystery"
            className = {styles.mysteryBox}
        />
        <div className = {styles.slotSection}>
            <InfoSlot label="Auteur(es)" info={answer.author} value = {40} decrementation={decrement}/>
            <InfoSlot label="Durée" info={answer.duration} value = {20} decrementation={decrement}/>
            <InfoSlot label="Genres" info={answer.genres} value = {10} decrementation={decrement}/>
            <InfoSlot label="Magazine" info={answer.magazine} value = {20} decrementation={decrement}/>

            <form onSubmit = {verifyAnswer}>
                <input type="text" placeholder="Ce manga est..." className = {styles.userAnswer} value = {userAnswer} onChange = {(e) => handleAnswer(e)}/>
                <button disabled = {!attemptsLeft || userAnswer.trim() === ""}>Je tente !</button>
                <h5 className = {`${styles.attemptsMessage} ${attemptsNumber.current === 3 ? styles.failed : ""}`}>{attemptsMessage}</h5>
            </form>
        </div>
    </div>)
}