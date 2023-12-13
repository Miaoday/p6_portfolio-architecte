// Get the Categories from API
async function getApiCategories() {  
   try {
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
// Get the DataSource Works from API
async function getApiWorks() {
   try {
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
   //   displayModal(works);
     return { categories, works };
   } catch (error) {
     console.error('Error fetching data:', error);
   }
}
// fetchData();
displayModal().then(works => {
console.log(works);  
}).catch(error => {
console.error(error);
});

// HomePageSetting
// Classify the works with the categories buttons
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
   const newsetWorksId = new Set(works.map(function (work){ 
      return work.categoryId; 
   })); 

   // Create catogorys buttons 
   newsetWorksId.forEach(categoryId => {
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

   document.querySelectorAll('.filtreBtn').forEach(btn => {
      if(token){
         btn.style.display = "none";
      }
   });
}

// Update dynamic portfolio works in gallery
const gallery = document.querySelector(".gallery");
const galleryId = document.getElementById("galleryid");

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

// Token status setting for Admin page
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

// Modal window settings
const modalWindow = document.querySelector('.modal-window');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalTriggers = document.querySelectorAll('.modal-trigger');

modalTriggers.forEach(trigger =>
   trigger.addEventListener("click", toggleModal));

function toggleModal () {
   modalWindow.classList.toggle("active")
}

// Import the project into the Modal Window
const editModal = document.getElementById('edit-modal');
async function displayModal () {
   try{
      const {works} = await fetchData();  // make sure works had initiated
      console.log(works);        
      // editModal.innerHTML = '';  // clear actual gallery elements
      works.forEach (work=> {  
         const figure = document.createElement("figure");
         const figureImg = document.createElement("img");
         const trashBtn = document.createElement("i");
         figure.id = work.id;
         figureImg.src = work.imageUrl;
         figureImg.alt = work.title;
         figureImg.crossOrigin = "anonymous";
         figure.className = work.categoryId;
         trashBtn.className += "fa-regular fa-trash-can";   
         trashBtn.setAttribute('id', work.id);
         // attatched figure into the gallery
         figure.appendChild(figureImg);
         figure.appendChild(trashBtn);
         editModal.appendChild(figure);
         // get the trash can
         document.querySelectorAll('.fa-trash-can').forEach((trashBtn)=> {                
            trashBtn.addEventListener('click', deletWork)   
            // console.log(trashBtn);             
            // console.log('Click trashButton')                   
         }); 
         return works;       
      }); 
   }catch (error) {
      console.log(error);        
}
return [];  
}
// displayModal().then(works => {
//    console.log(works);
// }).catch(error => {
//    console.error(error);
// });

// Delete the project with trashbin
async function deletWork(event) {
   let id = event.target.id;
   try{
      const response =
      await fetch (`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
         Authorization: `Bearer ${token}`,
         // 'Content-Type': 'application/json'
      }   
      });
  
   if (response.ok){
      // figure.remove();
      alert('Item deleted successfully');  
      fetchData();  
      displayModal();
               
   } else if (response===401){
      console.error('Unauthorized: You do not have permission to delete this image.');            
   } else if(response===500){
      console.error('Unexpected Behavior:', response.status);
   } else {
      console.error('Delete failed :', response.status);
   }

   } catch (error) {
      console.error('Error),', error);
   }
}

// Active another Modal window
const modalGallery = document.getElementById('modal-gallery');
const addProject = document.getElementById('add-photo');
const inputModal = document.getElementById('input-modal');
const returnBtn = document.querySelector('.toggle-return');
const addProjectBtn = document.getElementById('add-photo');
const submitProjectBtn = document.getElementById('submit-project');
function addFileClicked () {
addProject.addEventListener("click",() => {
   console.log("addProject button clicked")
   modalGallery.style.display = "none";
   inputModal.style.display = "block";  
   returnBtn.style.visibility = "visible";
   addProjectBtn.style.visibility = "hidden";
   submitProjectBtn.style.visibility ="visible";
});
}
addFileClicked();

// Return to Modal Gallery
function returnBtnClicked(){
returnBtn.addEventListener("click",() => {
   console.log("retrun button clicked");
   modalGallery.style.display = "block";
   inputModal.style.display = "none";  
   returnBtn.style.visibility = "hidden";
   addProjectBtn.style.visibility ="visible";
   submitProjectBtn.style.visibility ="hidden";
});
}
returnBtnClicked();

// Add the New Project 

function addNewProject(){



}

