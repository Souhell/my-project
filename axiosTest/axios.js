const axios = require("axios");

// const data = {
//     name: "Ali",
//     age: 30,
//     city: "Tehran"
// };

axios.request({
    url: "http://example.com",
    data : {
        name: "Ali",
        age: 30,
        city: "Tehran"
    },
    method: "POST",
    headers: {
        Cookie: "cookie1=value; cookie2=value; cookie3=value;"
    }
})
.then(response => {
    console.log("Server Response:", response.data);
})
.catch(error => {
    console.log("Error:", error.message);
});

/*
** مدل دیگری از اکسیوس
const axios = require("axios");

axios.request({
    url: "http://example.com",
    method: "POST",
    data: {
        name: "Ali",
        age: 30,
        city: "Tehran"
    },
    headers: {
        "Content-Type": "application/json",
        Cookie: "cookie1=value; cookie2=value; cookie3=value;"
    }
})
.then(response => {
    console.log("Server Response:", response.data);
})
.catch(error => {
    console.log("Error:", error.message);
});
*/