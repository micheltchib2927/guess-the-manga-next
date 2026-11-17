"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'
import styles from "./animeGameBlock.module.css"
import InfoSlot from "../infoSlot/page"

type answerTyping = {
    primaryTitle: string,
    possibleTitles: string[],
    studios: string,
    startSeason: string,
    numEpisodes: string,
    genres: string,
    pictureUrl: string
}

type studioObject = {
    
    id: number,
    name: string

}

type genreObject = {
    id: number,
    name: string
}

type relatedAnime = {
    node: {
        id: number,
        main_picture: string,
        title: string,
    }
    relation_type: string,
    relation_type_formatted: string
}

type animeTyping = {
    id: number,
    title: string,
    main_picture: {
        medium: string,
        large: string
    },
    alternative_titles: {
        en: string,
        ja: string,
        fr?: string
    },
    start_season: {
        season: string,
        year: number
    },
    studios: studioObject[],
    num_episodes: number,
    genres: genreObject[],
    related_anime: relatedAnime[]
}

type animeListElement = {
    node: animeTyping,
        
    ranking: {
        rank: number
    }
    
}

type animeListTyping = {
    data : animeListElement[]
}

export default function AnimeGameBlock() {

    const score = useRef(100);
    const attemptsNumber = useRef(0);
    const [answer, setAnswer] = useState<answerTyping>({primaryTitle: "", possibleTitles: [""], studios: "",startSeason: "", numEpisodes: "", genres: "", pictureUrl: ""})
    const [userAnswer, setUserAnswer] = useState("")
    const [chikaUrl, setChikaUrl] = useState("/idle-chika.png")
    const [imageUrl, setImageUrl] = useState("/mystery-box.png")

    const [attemptsMessage, setAttemptsMessage] = useState("Encore 3 essais");
    const [attemptsLeft, setAttemptsLeft] = useState(true);

    function sliceString(str : string, character : string) : string{
        const n = str.indexOf(character);
        return n === -1 ? str : str.slice(0, n);
    }

    function convertSeasonToFrench (season: string) : string{
        switch(season){
            case "fall": {
                return "Automne"
            }
            case "spring": {
                return "Printemps"
            }
            case "summer": {
                return "été"
            }
            default: {
                return "hiver"
            }
        }
    }

    useEffect(() => {
        const id = Math.floor(Math.random() * 100) + 1;
        async function getData(){
            try{
                const res = await fetch("/api/animeList");
                const dataList : animeListTyping = await res.json();
                console.log(dataList);

                const secondRes = await fetch(`api/anime?q=${dataList.data[id].node.id}`)
                const data : animeTyping = await secondRes.json();
                const relatedAnimeList = data.related_anime.filter((anime: relatedAnime) =>
                    anime.relation_type === "prequel"
                );
                console.log(data);

                setAnswer({
                    primaryTitle: data.title,

                    possibleTitles: [data.title.toLowerCase(), 
                        data.alternative_titles.en.toLowerCase(), 
                        data.alternative_titles.ja.toLowerCase(), 
                        data.alternative_titles.fr === undefined ? "" : data.alternative_titles.fr.toLowerCase(),
                        ...relatedAnimeList.map((anime) => anime.node.title.toLowerCase())
                    ],

                    studios: data.studios.length === 1 ? 
                    data.studios[0].name.toLowerCase()
                    : data.studios[0].name.toLowerCase() + " & " + data.studios[1].name.toLowerCase(),

                    startSeason: `${convertSeasonToFrench(data.start_season.season).toUpperCase()} ${data.start_season.year}`,

                    numEpisodes: `${data.num_episodes}`,

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
            <InfoSlot label="Studio(s)" info={answer.studios} value = {40} decrementation={decrement}/>
            <InfoSlot label="Saison" info={answer.startSeason} value = {20} decrementation={decrement}/>
            <InfoSlot label="Genres" info={answer.genres} value = {10} decrementation={decrement}/>
            <InfoSlot label="Nbr.Episodes" info={answer.numEpisodes} value = {20} decrementation={decrement}/>

            <form onSubmit = {verifyAnswer}>
                <input type="text" placeholder="Ce manga est..." className = {styles.userAnswer} value = {userAnswer} onChange = {(e) => handleAnswer(e)}/>
                <button disabled = {!attemptsLeft || userAnswer.trim() === ""}>Je tente !</button>
                <h5 className = {`${styles.attemptsMessage} ${attemptsNumber.current === 3 ? styles.failed : ""}`}>{attemptsMessage}</h5>
            </form>
        </div>
    </div>)
}