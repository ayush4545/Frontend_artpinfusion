const getUserName=(emailId:string)=>{
    const username= emailId.split("@")[0]
    return username
 }

export {getUserName}