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
const modalGallery = document.getElementById('modal-gallery');
const editModal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('.close-modal');
const addProjectBtn = document.getElementById('add-project');
const inputModal = document.getElementById('input-modal');
const returnBtn = document.querySelector('.return');
const submitProjectBtn = document.getElementById('submit-project');

modalTriggers.forEach(trigger =>
   trigger.addEventListener("click", toggleModal));
   
function toggleModal () {
   modalWindow.classList.toggle("active");
   if(modalWindow.classList.contains('active')) {
      addProjectBtn.addEventListener("click",()=>{
         returnBtn.style.visibility = "visible";
      });          
   }else  {
      closeReturnBtn();
   }
}

// Import the project into the Modal Window
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
            trashBtn.addEventListener('click', deleteWork)   
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
// Delete the project with trashbin button
async function deleteWork(event) {
   let id = event.target.id;
   try{
      const response = await fetch (`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
         Authorization: `Bearer ${token}`,
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
// function addFilePage(){
addProjectBtn.addEventListener("click",() => {
   console.log("Add project button clicked")
   modalGallery.style.display = "none";
   inputModal.style.display = "block";  
   returnBtn.style.visibility = "visible";
});
// }
// Return to Modal Gallery
// function returnPage(){
returnBtn.addEventListener("click",() => {
   modalGallery.style.display = "block";
   inputModal.style.display = "none";    
   returnBtn.style.visibility = "hidden";
});
// }
// Close Modal Button
function closeReturnBtn(){
   closeBtn.addEventListener("click",() => {
      console.log("close button clicked");
      modalGallery.style.display = "block";
      inputModal.style.display = "none";
      returnBtn.style.visibility = "hidden";    
      modalWindow.classList.toggle("active");    
   });
}
// addFilePage();
// returnPage();  
// Add the New Project in Modal Gallery
const modalForm = document.getElementById('modal-form');

function addNewProject(){
   modalForm.addEventListener("submit",async (event) => {
      event.preventDefault();
      const postData = new FormData(modalForm);
      try {
      await fetch("http://localhost:5678/api/works"),{
         method: "POST",
         body: postData,
         headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
         }
      }
      if (response.ok){
         console.log("New Projec submite successfully:", postData);
         fetchData();  
         displayModal();
         modalForm.reset();

      }else {
         alert("New Projec submite failed:", postData);
      }
      }catch (error) {
         console.error("Erreur :", error);
      }
   });
}
addNewProject();
// Preview the project on the page
const previewFile = document.getElementById('preview-file');
const inputFile = document.getElementById('input-file');
inputFile.addEventListener("change", treatFiles, false);

function treatFiles() {
   const fileListe = this.files;
   console.log(fileListe);
}