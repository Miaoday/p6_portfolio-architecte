// Get the DataSource Categories from the server API
async function getApiCategories() {  
   try {
      // get the Categories
      const getApiCategories = await fetch('http://localhost:5678/api/categories');
      if (!getApiCategories.ok) {
        throw Error('Network response was not ok');
      }
      if (getApiCategories.ok) {
         console.log('données récupérées avec succès')
      };
      const dataCatagories = await getApiCategories.json();
      console.log('Categories from API:', dataCatagories)
      return dataCatagories; 
   }  catch (error) {
      console.log('Fetch categories error:', error)
   }
}

// Get the DataSource Works from the server API
async function getApiWorks() {
   try {
   // get the Works
      const getApiWorks = await fetch('http://localhost:5678/api/works');
      if (!getApiWorks.ok) {
         throw Error('Works request failed');
      }
      if (getApiWorks.ok) {
         console.log('données récupérées avec succès')
      };
      const dataWorks = await getApiWorks.json();
      console.log('Works from API:', dataWorks)
      return dataWorks;
   } catch (error){
      console.log('Fetch works error:', error)
   }
}

// For treating the callback data
async function fetchData() {
   try {
     const categories = await getApiCategories(); // receive Categories Data  
     const works = await getApiWorks(); // receive Works Data
     // collecting all API Datas therfore retrieving by other function
     updateGallery(works); // calling updateGallery function
     filtreByCategories(categories,works); // calling filreByCategories function 
     return { categories, works };
   } 
   catch (error) {
     console.error('Error fetching data:', error);
   }
}
// fetchData(); // calling fetchData function

// Import the project into the Modal Window
let trashBin;
const editGallery = document.getElementById('edit-modal');
async function displayModal () {
   try{
      const {works} = await fetchData();  // make sure works had initiated
      console.log(works);        
      editGallery.innerHTML = '';  // clear actual gallery elements
      works.forEach (work=> {  
         const figure = document.createElement("figure");
         const figureImg = document.createElement("img");
         const trashIcon = document.createElement("i");
         figure.id = work.id;
         figureImg.src = work.imageUrl;
         figureImg.alt = work.title;
         figureImg.crossOrigin = "anonymous";
         figure.className = work.categoryId;
         trashIcon.className += "fa-regular fa-trash-can";   
         trashIcon.setAttribute('id','trash');
         // attatched figure into the gallery
         figure.appendChild(figureImg);
         figure.appendChild(trashIcon);
         editGallery.appendChild(figure);
      }); 
      return works; 
   } catch (error) {
      console.log(error);
      return [];
   }
}

displayModal().then(works => {
   console.log(works);

   // Delete the project with trashbin
   const trashBtns = document.querySelectorAll('.fa-trash-can');
   console.log(trashBtns); 
   [...trashBtns].forEach(trash=>{
      trash.addEventListener ('click', function(e) {
         try {
            let figure = this.parentNode;
            let projectId = figure.id;
            console.log(projectId);
            async function getDelet() {
               await fetch (`http://localhost:5678/api/works/${projectId}`, {
               method: 'DELETE',
               headers: {
                  Authorization: 'Bearer ${token}',
                  'Content-Type': 'application/json'
               }
               });
            }
            getDelet.then(function (response){

            if (response.status===204){
               figure.remove();
               // let figureElement = figure.id;
               // let deleteFigure = document.getElementById(figureElement);          
               // deleteFigure.remove();
               console.log('image deleted successfully');    
                        
            } else if (response.status===401){
               console.error('Unauthorized: You do not have permission to delete this image.');
               // statusOfResponse = response.status;
               // alertModalGallery.style.display = "flex";
               // alertModalGallery.innerHTML =
               // "Vous n'avez pas les autorisations pour effacer le fichier, statut " + resStatus;               
            } else {
               console.error('Failed to delete image:', response.status);
               // tatusOfResponse = response.status;
               // console.error('failed to delete image:', response.status);
               // alertModalGallery.style.display = "flex";
               // alertModalGallery.innerHTML =
               // "Impossible d'effacer le fichier, problème d'accès à l'API." + resStatus;
            } 
            });
            getDelet();

      } catch (error){
               console.error('Error deleting project:', error);
            }     
   })
}).catch(error => {
   console.error(error);
});
});
  
// Token status setting for the Admin page
const adminNav = document.getElementById('admin-nav');
const logInOut= document.getElementById('log-in-out');
const titlePortfolio = document.querySelector('.portfolio-title');
const modalButton = document.getElementById('modal-btn');
const filtreBtn = document.querySelectorAll('.filtreBtn');

let token = localStorage.getItem('token');
console.log('Token value:', token)

if (token){
   adminNav.style.display = "block";
   modalButton.style.visibility = "visible";
   logInOut.innerHTML = "logout";   
}

function logOut() {

   if(token===null){
      console.log('Token value is null')
      window.location.replace('./login.html');
   } else {
      localStorage.clear();
      window.location.replace('./index.html');
   }
};

logInOut.addEventListener("click",(e)=>{
   logOut();

})

const gallery = document.querySelector(".gallery");
const galleryId = document.getElementById("galleryid");

// Update portfolio works & gallery
function updateGallery (works) {
   gallery.innerHTML = '';  // clear actual gallery elements
   works.forEach(work=> {
      const figure = document.createElement("figure");
      const figureImg = document.createElement("img");
      const figcaption = document.createElement("figcaption");  
      figure.id = work.id;
      figureImg.src = work.imageUrl;
      figureImg.alt = work.title;
      figureImg.crossOrigin = "anonymous";
      figure.className = work.categoryId;
      figcaption.innerText = work.title;

      // attatched figure into the gallery
      figure.appendChild(figureImg);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
   });
}

// Classify the works
function filtreByCategories (categories,works) {    
   const classment = document.getElementById("filtres"); 
   // create the Button 'Tous'
   const buttonTous = document.createElement('button');
   buttonTous.classList.add('filtreBtn');
   buttonTous.innerText = 'Tous';
   buttonTous.setAttribute('id', 'all');
   // attatched the elements
   classment.appendChild(buttonTous);

   // use the New object Set to retreive works categorys ID
   const setOfWorksId = new Set(works.map(work => work.categoryId)); 

   // Create catogorys buttons 
   setOfWorksId.forEach(categoryId => {
      const btn = document.createElement('button');
      const category = categories.find(cat => cat.id === categoryId);
      btn.classList.add('filtreBtn');
      btn.innerText = category ? category.name : 'Unknown Category';
      btn.setAttribute('id', categoryId);
      // attatched the elements
      classment.appendChild(btn);

      btn.addEventListener('click', function() {
         console.log('Button clicked')
         const categoryIdNb = parseInt(this.getAttribute('id'));
         const worksFiltres = works.filter(work => work.categoryId === categoryIdNb);         
         console.log('Works filtered:', worksFiltres); 
         // calling function
         updateGallery(worksFiltres);        
      });
   });
   // click the button 'Tous'
   buttonTous.addEventListener('click', function() {
      updateGallery(works);
   }); 

   const hideBtns = document.querySelectorAll('.filtreBtn').forEach(btn => {
      if(token){
         btn.style.display = "none";
      }
   });
}

// Modal window settings
const modalWindow = document.querySelector('.modal-window');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalTriggers = document.querySelectorAll('.modal-trigger');

modalTriggers.forEach(trigger =>
   trigger.addEventListener("click", toggleModal));

function toggleModal () {
   modalWindow.classList.toggle("active")
}

const addProject = document.getElementById('add-photo');
// ajouterPhoto.addEventListener("click",(event) =>{
// })

