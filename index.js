const axios = require("axios");

let data = {
    name: "ali",
    age: 25,
    city : "Tehran"
}

for( let i =0;i<26;i++) {

}


try{
    axios.get("URL",data,)
        .then((response => {
    console.log("Server response:", response.data)
 }))
} catch(error) {
    console.log(error)
}