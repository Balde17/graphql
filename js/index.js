const graphqlEndpoint = "https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql"
const logingEndpoint = "https://learn.zone01dakar.sn/api/auth/signin"
let logedUsername = ""
document.addEventListener("DOMContentLoaded", () =>{
    checkToken()
})

const checkToken = () =>{
    const token = localStorage.getItem("jwtToken");
    if (token){
        //il ya une connection
        logData()
    }else{
        //charger la page login
        loadLoginPage()
    }
}



const logData = async () => {
    try {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            // Si le jeton n'est pas présent, peut-être rediriger vers la page de connexion ?
            // console.error("Le jeton JWT est manquant.");
            loadLoginPage()
            return;
        }

        // Ajouter le composant de la page principale uniquement si le jeton est présent
        const appContainer = document.querySelector("#App");
        appContainer.innerHTML = mainPageComponent();

        // Ajouter l'événement de déconnexion
        const logoutBtn = document.querySelector("#logout");
        logoutBtn.addEventListener("click", logoutHandler);

        await logUserInfos(token)
        await logLevel(token)
        await logAudit(token)
        await logSkills(token)

    } catch (error) {
        // console.error("Erreur :", error.message);
        logoutHandler()
    }
};

// Recuperer et afficher les information generales de l'utilisateur
const logUserInfos = async (token) =>{
  if (token){
      // Récupérer les données de l'utilisateur
      const { data } = await getData(userQuery, token);
      const user = data.user[0]
      // console.log("user", user)
      const xpAmount = data.xpTotal.aggregate.sum.amount

      // Convertir en mégaoctets si la taille est supérieure à 1024 KB
      let totalXpAmountMB = xpAmount >= 1000 ? xpAmount / 1000 : xpAmount;
      totalXpAmountMB = Math.round(totalXpAmountMB)
      const unit = xpAmount >= 1000 ? 'KB' : 'MB';
      
      const element = document.querySelector(".xp-amount")
      if (element){
          element.innerHTML = `<p><span>${totalXpAmountMB}</span> ${unit}</p>`
      }     

      // Afficher les données dans les champs spécifiques. 
      document.querySelector("#userName").textContent = `${user.firstName} ${user.lastName}`
      document.querySelector("#userEmail").textContent = user.email
      document.querySelector("#userCampus").textContent = user.campus
      document.querySelector("#userGender").textContent = user.attrs.gender
      document.querySelector("#userPhone").textContent = user.attrs.phone
      document.querySelector("#userAge").textContent = user.attrs.age
  }
}

// Recuperer et afficher le level de l'utilisateur
const logLevel = async (token) =>{
    if (token){
        // Récupérer les données de l'utilisateur
        const { data } = await getData(levelQuery, token);
        
        const level = data.maxLevelTransaction.nodes[0].amount
        const element = document.querySelector(".level-number-loc")
        if (element){
            element.textContent = level
        }
    }
}

// Afficher les audits (up et down)
const logAudit = async (token) =>{
    if (token){
        // Récupérer les données de l'utilisateur
        const { data } = await getData(auditRatioQuery, token);
        const auditUp = data.user[0].upAmount.aggregate.sum.amount
        const auditDown = data.user[0].downAmount.aggregate.sum.amount

        var auditRValue = (auditUp/auditDown).toFixed(1)
        document.querySelector(".audit-r-value").innerHTML = ` <p><span>${auditRValue}</span></p>`
        drawSVG(auditUp, auditDown)
    }
}

// Recuperer les skills de l'utilisateur
const logSkills = async (token) =>{
    if (token){
        // Récupérer les données de l'utilisateur
        const { data } = await getData(skillsQuery, token);
        const skills = data.skillTransactions
        // console.log("skills", skillsTab);
        drawSkills(skills)
        
    }
}

// Fonction qui permet de recuperer les données de toutes les requettes
const getData = async (query, token) =>{
    const options = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`,
        },
        body: JSON.stringify({query}),
    }

    try {  
        const response = await fetch(graphqlEndpoint, options)
        if (!response.ok){
            throw new Error ("GraphQl data fetching failed.")
        }
        return response.json()
    } catch (error) {
        throw new Error ("fetching data failed.")
    }
}


const drawSVG = (Aup, Adown) =>{
      google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Title', 'number'],
          ['Audit-up',     Aup],
          ['Audit-down',      Adown],
        ]);

        var options = {
          height: 700,
          width: 1300,
          fontSize: 30,
          pieHole: 0.4,
          backgroundColor: 'none',
          color: 'white'
        };

        var chart = new google.visualization.PieChart(document.querySelector('.audit-ratio'));
        chart.draw(data, options);
      }
}    

/***********************/
const drawSkills = (skills) =>{
    google.charts.load('current', {'packages':['bar']});

      google.charts.setOnLoadCallback(()=> drawChart(skills));

      function drawChart(skills) {

        let skillsTab = skills.map(obj => [obj.type, obj.amount])
        var dataTable = [['Skills', 'Niveau'], ...skillsTab]

        var data = google.visualization.arrayToDataTable(dataTable);

        var options = {
            legend: { position: 'none' },
            chart: {
              title: 'The skills i have.' },
            axes: {
              x: {
                0: { side: 'top', label: 'White to move'} // Top x-axis.
              }
            },
            bar: { groupWidth: "90%" }
          };
  
          var chart = new google.charts.Bar(document.getElementById('graph'));
          // Convert the Classic options to Material options.
          chart.draw(data, google.charts.Bar.convertOptions(options));
  
      }

}


/*Components file content*/
const loginComponent = () =>`
<div class="login">         
<form action="" class="login_form">
   <h1 class="login_title">Login</h1>
   <div class="login_content">
      <div class="login_box">
         <div class="login_box-input">
            <label for="" class="login_label">Username/Email</label>
            <input type="email" required class="login_input" id="login-email" placeholder=" ">
         </div>
      </div>
      <div class="login_box">

         <div class="login_box-input">
            <label for="" class="login_label">Password</label>
            <input type="password" required class="login_input" id="login-pass" placeholder=" ">
         </div>
      </div>
   </div>
   <button class="login_button">Login</button>

   <p id="error_msg"></p>
</form>
</div>`


const mainPageComponent = () => `<div id="main">
<button id="logout">Logout</button>
<div id="general-info" class="section">
   <h2>General informations</h2>
   <hr/>

   <div class="general-info-div">
   
      <div>
         <table>
            <tr>
               <th>Name :</th>
               <td id="userName"></td>
            </tr>
            <tr>
               <th>Email :</th>
               <td id="userEmail"></td>
            </tr>
            <tr>
               <th>Campus:</th>
               <td id="userCampus"></td>
            </tr>
         </table>
      </div>
      <div>
         <table>
            <tr>
               <th>Gender :</th>
               <td id="userGender"></td>
            </tr>
            <tr>
               <th>Phone :</th>
               <td id="userPhone"></td>
            </tr>
            <tr>
               <th>Age :</th>
               <td id="userAge"></td>
            </tr>
         </table>
      </div>
   </div>
</div>

<div id="skills" class="section">
   <div class="level">
        <h3 class="level-title">Level</h3>
        <hr>
        <div class="level-number">
            <p>Level</p> 
            <p class="level-number-loc">24</p>
        </div>
   </div>
   <div class="xp">
        <h3 class="xp-title">XP</h3>
        <hr>
        <div class="xp-amount"></div>
   </div>
   <div class="audit-r">
      <h3>Audit ratio</h3>
      <hr>
      <div class="audit-r-value"></div>
   </div>
   </div>
   
   <div id="audit" class="section">
        <h3>Audit ratios</h3>
        <hr>
        <div class="audit-ratio" style="width: 700px; height: 200px; margin:auto;"></div>
   </div>
<div id="graph" class="section">

</div>
</div>`

/*graphQlRequest file content*/
const userQuery = `
{
    user{
        login
        firstName
        lastName
        email
        campus
        auditRatio
        attrs
    }
    xpTotal: transaction_aggregate(
      where: {
        type: { _eq: "xp" },
        _and: [
          { path: { _ilike: "/dakar/div-01%" } },
          { path: { _nlike: "%/dakar/div-01/piscine-js/%" } },
          { path: { _nlike: "%/dakar/div-01/piscine-js-2/%" } }
        ]
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
}
`

  const levelQuery = `
  {
    maxLevelTransaction: transaction_aggregate(
      where: { type: { _eq: "level" }, path: { _ilike: "%/dakar/div-01%" } },
      order_by: { amount: desc },
      limit: 1
    ) {
      nodes {
        amount
      }
    }
  }`

  const skillsQuery = `
  {
    skillTransactions: transaction(
      distinct_on:[type]
      where: {
        type: { _ilike: "%skill%" },
      },
      order_by:{amount:desc,type:asc}
      
    ) {
      type
      amount
    }
  }`

  const auditRatioQuery = `
  {
    user{
     upAmount: transactions_aggregate(
       where: {type: {_eq: "up"}}
     ){
       aggregate{
         sum{amount}
       }
     }
     downAmount: transactions_aggregate(
       where: {type: {_eq: "down"}}
     ){
       aggregate{
         sum{amount}
       }
     }
   }
   }`

   /*Signin file content*/

   const loadLoginPage = () =>{
    let app = document.querySelector("#App")
    if (app){
        app.innerHTML = loginComponent()
        document.querySelector(".login_button").addEventListener("click", loginHandler)
    }
}


const loginHandler = async (event) =>{
    const username = document.querySelector("#login-email").value.trim()
    const password = document.querySelector("#login-pass").value.trim()

    if (username === "" || password === "" ){
        document.querySelector('#error_msg').innerHTML = "Field all the informations please";
        return
    }else{
        const credentials = {
            username: username,
            password: password
        }
        const token = await signIn(credentials)
                
        if (token) {
            localStorage.setItem("jwtToken", token)
            logData()
        }
    }
}

const encodeBase64 = (str) => btoa(str);

const signIn = async (credentials) => {
    try {
        const encodedCredentials = encodeBase64(`${credentials.username}:${credentials.password}`);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${encodedCredentials}`,
            },
        };

        let response = await fetch(logingEndpoint, options);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        } else {
            document.querySelector('#error_msg').innerHTML = "login/password is incorrect";
            return
        }
                
    } catch (error) {
        throw new Error("Login request failed.");
    }
};


const logoutHandler = () =>{
    const appContainer = document.querySelector("#App")
    appContainer.innerHTML = ''
    loadLoginPage()
    localStorage.removeItem("jwtToken")
}