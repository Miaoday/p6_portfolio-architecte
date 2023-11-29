// LogingPage
// Request the User DataSource 
// const submit= document.getElementById("submitConnected");
// document.getElementById("emailInput").focus()
// // added event listening on the connect button
// async function loginRequest (userData) {
//     try {
//        let response = await fetch ('http://localhost:5678/api/users/login', {
//        method : "POST",
//        headers : {"Content-Type": "application/json;charset=utf-8"},
//        body : JSON.stringify(userData)
//        });
//        if(response.ok) { // Request succeded         
//           const userData = await response.json();
//           console.log('Request Succeded',userData);
//           localStorage.setItem("token", userData.token);
//           return userData; // then store the response in the data          
//        } else {// treat the response as an error         
//           console.error('Request Failed',response.status);
//           }
//        } catch (error) {
//           // trying catch other error
//           console.error('Error', error);
//           throw error;
//        }
//  }
const submit = document.getElementById('submitConnected');
const email = document.getElementById('emailInput').focus();
// submit.addEventListener("click", (e) => {
//    e.preventDefault();
//    let email = document.getElementById("emailInput").value;
//    let password = document.getElementById("passwordInput").value;
//    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
//       document.getElementById("error").innerHTML =
//          "Entrer un E-mail valide!";
//       error.classList = "error";
//       return;
//    }
//    else if (!password) {
//       document.getElementById("error").innerHTML =
//             "Entrer un mot de passe !"
//       error.classList = "error";
//       return;
//     }
   
//     const userData = {email, password}
//     console.log(userData)
//     loginRequest(userData)
//     alert("valid")
//     window.location.replace("./index.html");
    
// })

// // ////////
async function loginRequest(userData) {
   try { 
      let response = await fetch ('http://localhost:5678/api/users/login', {

         method : "POST",
         headers : {"Content-Type": "application/json;charset=utf-8"},
         body : JSON.stringify(userData)

      });

      if(response.status===200) {
         const userData = await response.json();
         localStorage.setItem('token',userData.token);
         console.log('Request Succeded');
         
         alert();
         window.location.replace("./index.html");
         return userData; 
      
         // then store the response in the data
      } else {
         // restore the error
         console.error('Request Failed', response.status);
         }
      } catch (error) {
         // trying catch other error
         console.error('Error');
         // throw error;
         throw error;
      }
}; 

// click submit and send request to server 
submit.addEventListener('click', (e)=>{
   e.preventDefault();
   let email = document.getElementById('emailInput').value;
   let password = document.getElementById('passwordInput').value;
   
   if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
      document.getElementById('error').innerHTML ='Email not found';
      error.classList.add('error');
      return false;

   } else if(!password){
      document.getElementById('error').innerHTML ='Password incorrect';
      error.classList.add('error');
      return false;
   }
   const userData = {email: email, password: password};
   console.log(userData)
   loginRequest(userData)
});



// Ici on a une fonction. En entrée on a deux paramètres a et b
// En sortie on a le resultat a + b
// function addition (a, b) {
//    return a + b
//  }
//  const resultat = addition(5, 4)