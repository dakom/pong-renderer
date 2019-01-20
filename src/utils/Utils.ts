export const getObjValues = (obj:any) =>
    Object.keys(obj).map(key => obj[key]);


export const unreachable = (_:never) => {
    throw new Error("unreachable"); 
}
