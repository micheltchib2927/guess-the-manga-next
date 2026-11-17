"use client"
import { useState } from 'react'
import styles from './sideBar.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function SideBar () {

    const categoryList: string[] = ["Accueil", "Manga", "Anime", "Aide"];
    const [open, setOpen] = useState(false);

    function toggleOpen (){
        setOpen((prev) => !prev);
    }

    return(<div className = {styles.sideBar}>
        <button className = {styles.sideBarButton} onClick = {toggleOpen}>
            <Image
                src="/sidebar-icon.png"
                width={60}
                height={40}
                alt="Three lines icon"
            />
        </button>
        <ul className = {`${styles.categoryList} ${open ? styles.openBar : ""}`}>
            {categoryList.map(category => <li key={category}><Link className = {styles.link} href = {category === "Accueil" ? "/" : `/${category.toLowerCase()}`}>{category}</Link></li>)}
        </ul>
    </div>)
}