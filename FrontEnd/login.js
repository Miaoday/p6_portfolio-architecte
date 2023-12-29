// LogingPage
const errorMessage = document.getElementById('error-message');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');
const submit = document.getElementById('submitConnected');

// Request the User DataSource 
async function loginRequest(userData) {
   try { 
      let response = await fetch ('http://localhost:5678/api/users/login', {
         method : "POST",
         headers : {"Content-Type": "application/json;charset=utf-8"},
         body : JSON.stringify(userData)
      });

      if(response.status===200) {
         // then store the response in the data
         const userData = await response.json();
         localStorage.setItem('token',userData.token);   
         console.log('Request Succeded');
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
   console.log(e);
   e.preventDefault();
   const userEmail = email.value;
   const userPassword = password.value;
   const userData = {email: userEmail, password: userPassword};
   console.log(userData)
   loginRequest(userData)
   // let email = document.getElementById('emailInput').value;
   // let password = document.getElementById('passwordInput').value; 
   // if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
   //    // const email = document.getElementById('emailInput');
   //    document.getElementById('error').innerHTML =
   //    'Email incorrect';
   //    error.classList.add('error');
   //    email.style.border = "1px solid #FF0000";
   //    return false;

   // } else if(!password){
   //    // const password = document.getElementById('passwordInput');
   //    document.getElementById('error').innerHTML =
   //    'Password incorrect';
   //    error.classList.add('error');
   //    password.style.border = "1px solid #FF0000";
   //    return false;
   // } 
});
