export const dateformat=(date)=>{
    return new Date(date).toLocaleString('en-us',{
        weekday:'short',
        month:'long',
        day:'numeric',
        hour:'numeric',
        minute:'numeric'

    })
}

export default dateformat;