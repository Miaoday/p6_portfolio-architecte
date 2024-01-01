// Catch DOM tree
const gallery = document.querySelector(".gallery");
const galleryId = document.getElementById("galleryid");

const adminNav = document.getElementById('admin-nav');
const logInOut= document.getElementById('log-in-out');
const titlePortfolio = document.querySelector('.portfolio-title');
const modalButton = document.getElementById('modal-btn');
const filtreBtn = document.querySelectorAll('.filtreBtn');
const filtreSelected = document.querySelectorAll('.filtre-selected');

const modalWindow = document.querySelector('.modal-window');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalTriggers = document.querySelectorAll('.modal-trigger');

const modalGallery = document.getElementById('modal-gallery');
const editModal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('.close-modal');
const addProjectBtn = document.getElementById('add-project');

const inputModal = document.getElementById('input-modal');
const returnBtn = document.querySelector('.fa-arrow-left');
const messageA = document.getElementById('message-a');
const submitProjectBtn = document.getElementById('submit-project');
const modalForm = document.getElementById('modal-form');
const previewFile = document.getElementById('preview-file');
const labelPreviewImg = document.getElementById('label-img');
const spanPreviewImg = document.querySelector('span');
const uploadFile = document.getElementById('input-file');
const inputTitle = document.getElementById('input-file-title');
const categorySelected = document.getElementById('selected-category');
const messageB = document.getElementById('message-b');
const addFileBtn = document.querySelector('.add-file')

// Get the Categories from API
async function getApiCategories() {  
   try {
      const getApiCategories = await fetch('http://localhost:5678/api/categories');
      if (!getApiCategories.ok) {
        throw Error('Network response was not ok');
      }

      const dataCatagories = await getApiCategories.json();
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

      const dataWorks = await getApiWorks.json();
      return dataWorks;
   } catch (error){
      console.error('Fetch works error:', error)
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

// Home page setting //
// Update dynamic portfolio works of gallery
function updateGallery (works) {
   gallery.innerHTML = '';  // clear actual main page gallery elements

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

// Classify the works with the categories buttons
function filtreByCategories (categories,works) {    
   const classment = document.getElementById("filtres"); 
   classment.innerHTML= "";

   // Create the "All" Button 
   const allBtn = document.createElement('button');
   allBtn.className += "filtreBtn";
   allBtn.innerText = 'Tous';
   allBtn.setAttribute('id', 'all');
   
   // Attatched the elements
   classment.appendChild(allBtn);
   
   // New object Set to retreive works categorys ID
   const sortCategoriesIds = [...new Set(works.map(work => work.categoryId))].sort((a, b) => {
      return a - b;
   }); 

   sortCategoriesIds.forEach(categoryId => {
      // create all the filtre buttons
      const btn = document.createElement('button');
      const category = categories.find(cat => cat.id === categoryId);
      btn.className += "filtreBtn";
      btn.innerText = category ? category.name : 'Unknown Category';
      btn.setAttribute('id', categoryId);
      
      // Attatched the elements
      classment.appendChild(btn);
      
      // click those categories buttons
      btn.addEventListener('click', function() {
         const categoryIdNb = parseInt(this.getAttribute('id'));
         const worksFiltres = works.filter(work => work.categoryId === categoryIdNb);         
         
         updateGallery(worksFiltres);  // calling function
         
         // take off all the class name 'filtre-selected' 
         document.querySelectorAll('.filtreBtn').forEach(button => {
            button.classList.remove('filtre-selected');
         });
         
         // add the class name 'filtre-selected'
         this.classList.add('filtre-selected');                         
      });
   });

   // click the "All" button 
   allBtn.addEventListener('click', function() {
      updateGallery(works);

      // take off all the class name 'filtre-selected' 
       document.querySelectorAll('.filtreBtn').forEach(button => {
         button.classList.remove('filtre-selected');
      });
      
      // add the class name 'filtre-selected'
      this.classList.add('filtre-selected');
   }); 

   // While login is active, we hide the categories buttons
   document.querySelectorAll('.filtreBtn').forEach(btn => {
      if(token){
         btn.style.display = "none";
      }
   });
}

// Token //
// Token status setting for login 
let token = localStorage.getItem('token');
console.log('Token value:', token)

if (token){
   adminNav.style.display = "block";
   titlePortfolio.style.flexDirection= "row";
   titlePortfolio.style.marginInlineStart= "6em";
   modalButton.style.visibility = "visible";
   logInOut.innerHTML = "logout";   
}

function logOut() {

   if(token===null){
      window.location.replace('./login.html');
   } else {
      // clear the token
      localStorage.clear(); 
      window.location.replace('./index.html');
   }
};

logInOut.addEventListener("click",(e)=>{
   logOut();
})

// Modal Window // 
// modal settings
let modal = null;
const openModal = function(e) {
   e.preventDefault();
   const target = document.querySelector(e.target.getAttribute('href'));
   target.style.display = null;
   target.removeAttribute('aria-hidden');
   target.setAttribute('aria-modal', 'true');
   modal = target;
   modal.addEventListener('click', closeModal)
   modal.querySelector('.js-close').addEventListener('click', closeModal);
   modal.querySelector('.js-stop').addEventListener('click', stopPropagation);
}

const closeModal = function(e) {
   if (modal === null) return ; 
   e.preventDefault();
   modal.style.display = "none";
   modal.setAttribute('aria-hidden', true);
   modal.removeAttribute('aria-modal');
   modal.addEventListener('click', closeModal);
   modal.querySelector('.js-close').removeEventListener('click', closeModal);
   modal.querySelector('.js-stop').removeEventListener('click', stopPropagation);
   modal = null;
}

const stopPropagation = function(e) {
   e.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
   a.addEventListener("click", openModal)
});

// Import the project into the Modal Window
async function displayModal () {
   try{
      const {works} = await fetchData();  // make sure works had initiated     
      editModal.innerHTML = '';  // clear actual modal window gallery elements

      works.forEach (work=> {  
         const figure = document.createElement("figure");
         const figureImg = document.createElement("img");
         const span = document.createElement("span");
         const trashBtn = document.createElement("i");
         figure.id = work.id;
         figureImg.src = work.imageUrl;
         figureImg.alt = work.title;
         figureImg.crossOrigin = "anonymous";
         figure.className = work.categoryId;
         trashBtn.className += "fa-regular fa-trash-can";   
         trashBtn.setAttribute('id', work.id);

         // attatched figure into the gallery
         span.appendChild(trashBtn);
         figure.appendChild(figureImg);
         figure.appendChild(span);
         editModal.appendChild(figure);

         // get the trash can
         document.querySelectorAll('.fa-trash-can').forEach((trashBtn)=> {                
            trashBtn.addEventListener('click', deleteWork)                   
         });         
          
      }); 
   }catch (error) {
      console.log(error);        
}
return [];  
}

// Delete the project with trashbin button
async function deleteWork(event) {
   gallery.innerHTML = ''; 
   let id = event.target.id;

   try{
      const response = await fetch (`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
         Authorization: `Bearer ${token}`,
      }   
      });
  
   if (response.ok){    
      document.getElementById('message-a').innerHTML=
      "Project deleted successfully!";
      messageA.style.display = "flex"; 

      // refresh those gallerys elements     
      displayModal();
               
   } else if (response===401){
      document.getElementById('message-a').innerHTML=
      "You do not have permission to delete this image!";
      messageA.style.display = "flex"; 
      console.error('Unauthorized: You do not have permission to delete this image.');            
   } else if(response===500){
      document.getElementById('message-a').innerHTML=
      "Unexpected Behavior!";
      messageA.style.display = "flex"; 
      console.error('Unexpected Behavior:', response.status);
   } else {
      console.error('Delete failed :', response.status);
   }
   } catch (error) {
      console.error('Error),', error);
   }
   setTimeout(function () {
      messageA.style.display = "none";       
   }, 1000);  
}

// Add the New Project in Modal Gallery
async function addNewProject() {
   modalForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Create a new object with FormData
      const data = new FormData();      
      data.append('image', uploadFile.files[0]);
      data.append('title', inputTitle.value);
      data.append('category', categorySelected.value);

      try {
      const response = await fetch("http://localhost:5678/api/works",{
         method: "POST", 
         body: data,
         headers:{
            Authorization: `Bearer ${token}`,  
         }   
      })

      if (response.ok) {        
         // Reset Modal Form
         modalForm.reset();           
         // Submit successed message  
         document.getElementById('message-b').innerHTML=
         "New Project submited successfully!";
         messageB.style.display = "flex";
         
         // Add dynamically a new project without refresh the pages
         const newProject = await response.json();
         updateGallery([newProject]);       
       
         // dynamiser la modal apres ajouter le projet sans rafaichir la page 
         displayModal();  
      }
      else {
         console.error("Error");
         // alert new project submited been failed
         document.getElementById('message-b').innerHTML=
         "New Projec submite failed!";
         messageB.style.display = "flex";
      }
      }catch (error) {
         console.error("Erreur :", error);
      }   
      setTimeout(function () {
         initiateForm(); 
      }, 1000);     
   });
   postCategory();  
}

//1. Choose the file project to upload (input)
uploadFile.addEventListener("change", treatFiles, false);

function treatFiles() {
   const fileListe = this.files;
   console.log(fileListe);
   readUrl(this);
}

//2.Get and read the Files objects detail
function readUrl(input) {

   if (input.files && input.files[0]) {
      const newImg = new FileReader();
      newImg.onload = function(e) {

      //4. Link the file with <img>
      previewFile.src = e.target.result;
      previewFile.style.visibility = ("visible");
      labelPreviewImg.style.visibility = ("hidden");
      }
      //3. Preview the file 
      newImg.readAsDataURL(input.files[0]);    
      document.getElementById('input-file-title').focus();   
   }
}

//Choose and post the categorys
async function postCategory () {

   try{  
      const {categories} = await fetchData();     
      
       // Ajouter l'option par défaut
       const defaultOption = document.createElement('option');
       defaultOption.value = ""; 
       defaultOption.selected = true;  
       defaultOption.hidden = true;
       categorySelected.appendChild(defaultOption);

      categories.forEach((category) => {
      const option = document.createElement('option');    
      option.value = category.id;
      option.textContent = category.name;
      categorySelected.appendChild(option);

      });    
   } 
   catch(error){
      console.error("post failed, cannot find categories");
   }
}

function initiateForm() {
   previewFile.src = "";
   previewFile.style.visibility = ("hidden");
   labelPreviewImg.style.visibility = ("visible");
   inputTitle.value= "";
   messageB.style.display = "none";
}

// Active input modal window
function toFilePage() {
   addProjectBtn.addEventListener("click",() => {
      modalGallery.style.display = "none";
      inputModal.style.display = "block";  
      returnBtn.style.visibility = "visible"; 
      initiateForm();   
   });
}

// Return to Modal Gallery
returnBtn.addEventListener("click", toGalleryPage);

function toGalleryPage() {
   modalGallery.style.display = "block";
   inputModal.style.display = "none";    
   returnBtn.style.visibility = "hidden";   
}

toFilePage();
toGalleryPage();
addNewProject();
displayModal();
