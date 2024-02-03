// const loadLoginPage = () =>{
//     let app = document.querySelector("#App")
//     if (app){
//         app.innerHTML = loginComponent()
//         document.querySelector(".login_button").addEventListener("click", loginHandler)
//     }
// }


// const loginHandler = async (event) =>{
//     const username = document.querySelector("#login-email").value.trim()
//     const password = document.querySelector("#login-pass").value.trim()

//     if (username === "" || password === "" ){
//         document.querySelector('#error_msg').innerHTML = "Field all the informations please";
//         return
//     }else{
//         const credentials = {
//             username: username,
//             password: password
//         }
//         const token = await signIn(credentials)
                
//         if (token) {
//             localStorage.setItem("jwtToken", token)
//             logData()
//         }
//     }
// }

// const encodeBase64 = (str) => btoa(str);

// const signIn = async (credentials) => {
//     try {
//         const encodedCredentials = encodeBase64(`${credentials.username}:${credentials.password}`);

//         const options = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Basic ${encodedCredentials}`,
//             },
//         };

//         let response = await fetch(logingEndpoint, options);

//         if (!response.ok) {
//             throw new Error(`Erreur HTTP : ${response.status}`);
//         } else {
//             return await response.json();
//         }
                
//     } catch (error) {
//         throw new Error("Login request failed.");
//     }
// };


// const logoutHandler = () =>{
//     const appContainer = document.querySelector("#App")
//     appContainer.innerHTML = ''
//     loadLoginPage()
//     localStorage.removeItem("jwtToken")
// }