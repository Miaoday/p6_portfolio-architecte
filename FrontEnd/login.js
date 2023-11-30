// LogingPage
const submit = document.getElementById('submitConnected');
const email = document.getElementById('emailInput').focus();
// Request the User DataSource 
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
         // then store the response in the data
         console.log('Request Succeded');
         alert('Admin Login Success');
         window.location.replace("./index.html");
         return userData; 
         
      } else {
         // restore the error
         console.error('Request Failed', response.status);
      }
   } 
   catch (error) {
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
      document.getElementById('error').innerHTML =
      'Email incorrect';
      error.classList.add('error');
      return false;

   } else if(!password){
      document.getElementById('error').innerHTML =
      'Password incorrect';
      error.classList.add('error');
      return false;
   }
   const userData = {email: email, password: password};
   console.log(userData)
   loginRequest(userData)
});

// une function ca fait un travail 
// Ici on a une fonction. En entrée on a deux paramètres a et b
// En sortie on a le resultat a + b
// function addition (a, b) {
//    return a + b
//  }
//  const resultat = addition(5, 4)