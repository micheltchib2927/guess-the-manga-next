
import { NextResponse} from 'next/server'

export async function GET(request){

    try{
        const res = await fetch(
            `https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=250&`,
            
            {
                headers: {"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID},
                next: {revalidate: 3600}
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