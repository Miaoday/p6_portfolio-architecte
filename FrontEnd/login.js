// LoginPage
const errorMessage = document.getElementById('error-message');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');
const submit = document.getElementById('submitConnected');

// Request the User DataSource 
async function loginRequest(userData) {
   try { 
      let response = await fetch ('http://localhost:5678/api/users/login', {
         // request de Post pour avoir l'authentification d'user
         method : "POST",    
         headers : {"Content-Type": "application/json;charset=utf-8"},
         body : JSON.stringify(userData)
      });

      if(response.status===200) {
         // store the response in the localStorage
         const userData = await response.json();
         localStorage.setItem('token',userData.token);   
         window.location.replace("./index.html");
         return userData;      
      } 
      else if (!response.ok) {  // restore the error
         console.error('Request Failed', response.status);
         email.style.border = "1px solid #FF0000";
         password.style.border = "1px solid #FF0000";
         errorMessage.innerText = 'E-mail & Password Error';
         errorMessage.classList.add('error');        
         return false;       
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
   const userEmail = email.value;
   const userPassword = password.value;
   const userData = {email: userEmail, password: userPassword};
   console.log(userData)
   loginRequest(userData)
});
