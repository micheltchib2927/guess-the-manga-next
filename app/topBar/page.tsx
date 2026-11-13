import styles from './topBar.module.css'
import Image from 'next/image'
import SideBar from '../sideBar/page'

export default function TopBar () {
    
    return(<div className = {styles.topBar}>
        <h1 className = {styles.title}>GuessTheManga</h1>
        <SideBar/>
    </div>)
}