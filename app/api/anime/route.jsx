
import { NextResponse} from 'next/server'

export async function GET(request){

    const q = request.nextUrl.searchParams.get("q");

    try{
        const res = await fetch(
            `https://api.myanimelist.net/v2/anime/${q}?fields=title,main_picture,alternative_titles,studios,num_episodes,genres,start_season,related_anime`,
            
            {
                headers: {"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID}
            }
        )
        if(!res.ok){
            return NextResponse.json({error: "Erreur serveur externe", status: res.status});
        }
        const data = await res.json();

        return NextResponse.json(data);
    }
    catch(e){
        return NextResponse.json({error: "Erreur serveur", status: 500});
    }
}