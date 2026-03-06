import { BASE_URL,getAuthHeaders } from "./config";

export const fetchWatchLists=async()=>{
    const response=await fetch(`${BASE_URL}/v1/api/watchlist/list`,{
        headers:getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch watchlists');
    return response.json();
}
export const fetchWatchListScrips=async(watchlistId:number)=>{
    const response=await fetch(`${BASE_URL}/v1/api/watchlist/scripts/list`,{
        method:'POST',
        headers:{...getAuthHeaders(),'Content-Type':'application/json'},
        body:JSON.stringify({watchlistId})
    })
}