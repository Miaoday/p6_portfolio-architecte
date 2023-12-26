// Catch DOM tree
const gallery = document.querySelector(".gallery");
const galleryId = document.getElementById("galleryid");

const adminNav = document.getElementById('admin-nav');
const logInOut= document.getElementById('log-in-out');
const titlePortfolio = document.querySelector('.portfolio-title');
const modalButton = document.getElementById('modal-btn');
const filtreBtn = document.querySelectorAll('.filtreBtn');

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
      else if (getApiCategories.ok) {
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
      else if (getApiWorks.ok) {
         console.log('données récupérées avec succès')
      };
      const dataWorks = await getApiWorks.json();
      console.log('Works from API:', dataWorks)
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

// HomePageSetting
// Classify the works with the categories buttons
function filtreByCategories (categories,works) {    
   const classment = document.getElementById("filtres"); 
   classment.innerHTML= "";
   // create the Button 'Tous'
   const allButton = document.createElement('button');
   allButton.classList.add('filtreBtn');
   allButton.innerText = 'Tous';
   allButton.setAttribute('id', 'all');
   // attatched the elements
   classment.appendChild(allButton);

   // use the New object Set to retreive works categorys ID
   const sortCategoriesIds = [...new Set(works.map(work => work.categoryId))].sort((a, b) => {
      return a - b;
   }); 

   // Create catogorys buttons 
   sortCategoriesIds.forEach(categoryId => {
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
   allButton.addEventListener('click', function() {
      updateGallery(works);
   }); 

   document.querySelectorAll('.filtreBtn').forEach(btn => {
      if(token){
         btn.style.display = "none";
      }
   });
}

// Update dynamic portfolio works of gallery
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
      // clear the token
      localStorage.clear(); 
      window.location.replace('./index.html');
   }
};

logInOut.addEventListener("click",(e)=>{
   logOut();
})

// Modal window settings
modalTriggers.forEach(trigger =>
   trigger.addEventListener("click", toggleModal));
   
function toggleModal () {
   modalWindow.classList.toggle("active");
   if (modalWindow.classList.contains('active')) {
      addProjectBtn.addEventListener("click",()=>{
         returnBtn.style.visibility = "visible";
      });          
   }else  {
      noReturnBtn();
   }
}

// Import the project into the Modal Window
async function displayModal () {
   try{
      const {works} = await fetchData();  // make sure works had initiated
      console.log(works);        
      editModal.innerHTML = '';  // clear actual gallery elements
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
      // figure.remove();
      // alert('Item deleted successfully');
      document.getElementById('message-a').innerHTML=
      "Project deleted successfully!";
      messageA.style.display = "flex";
        
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
function addFilePage(){
addProjectBtn.addEventListener("click",() => {
   modalGallery.style.display = "none";
   inputModal.style.display = "block";  
   returnBtn.style.visibility = "visible";  
   previewFile.src = "";
   previewFile.style.visibility = ("hidden");
   addFileBtn.style.visibility = ("visible");
   inputTitle.value= "";
   console.log(inputTitle.value);
});
}

// Return to Modal Gallery
function toGalleryPage() {
returnBtn.addEventListener("click",() => {
   console.log("coucou gallery");
   modalGallery.style.display = "block";
   inputModal.style.display = "none";    
   returnBtn.style.visibility = "hidden";   
});
}

// Debug return Button
function noReturnBtn() {
   closeBtn.addEventListener("click",() => {
      modalGallery.style.display = "block";
      inputModal.style.display = "none";
      returnBtn.style.visibility = "hidden";    
      // modalWindow.classList.toggle("active");    
      console.log("byebye returnButton");
   });
}

// Close Modal Window
// function closeModalWindow(){
//    modalWindow.style.display = "none";
// }
 
// Add the New Project in Modal Gallery
async function addNewProject() {
   modalForm.addEventListener("submit", async (event) => {
      console.log(modalForm);
      event.preventDefault();
      const data = new FormData();      
      data.append('image', uploadFile.files[0]);
      data.append('title', inputTitle.value);
      data.append('category', categorySelected.value);
      // console.log('image', uploadFile.files[0]);
      // console.log('title', inputTitle.value);
      // console.log('category', categorySelected.value);
      try {
      const response = await fetch("http://localhost:5678/api/works",{
         method: "POST", 
         body: data,
         headers:{
            Authorization: `Bearer ${token}`,  
            // "Content-Type": "multipart/form-data"
         }   
      })
      if (response.ok){                     
         // Reset Modal Form
         modalForm.reset();    
         // ajout dynamique de la nouvelle image
         const newProject = await response.json();
         updateGallery([newProject]);       
         // toGalleryPage(); 
         // console.log(toGalleryPage());        
         // dynamiser la modal apres ajouter le projet sans rafaichir la page 
         displayModal();  
         // successed message  
         document.getElementById('message-b').innerHTML=
         "New Project submited successfully!";
         messageB.style.display = "flex";       
      }
      else {
         // alert("New Projec submite failed");
         document.getElementById('message-b').innerHTML=
         "New Projec submite failed!";
         messageB.style.display = "flex";
      }
      }catch (error) {
         console.error("Erreur :", error);
      }         
   });
   postCategory();
}

//1. Choose the file project to upload (input)
uploadFile.addEventListener("change", treatFiles, false);
console.log(uploadFile);

function treatFiles() {
   const fileListe = this.files;
   console.log(fileListe);
   console.log(this);
   readUrl(this);
}

//2.Get and read the Files objects detail
function readUrl(input) {
   if (input.files && input.files[0]) {
      const newImg = new FileReader();
      newImg.onload = function(e) {
      console.log(e);
         //4. Link the file with <img>
      previewFile.src = e.target.result;
      previewFile.style.visibility = ("visible");
      addFileBtn.style.visibility = ("hidden");
      }
      //3. Preview the file 
      newImg.readAsDataURL(input.files[0]);  
      console.log(newImg);   
      document.getElementById('input-file-title').focus();   
   }
}

//Choose and post the categorys
async function postCategory () {
   try{  
      const {categories} = await fetchData();     
      console.log(categories);
      
      categories.forEach((category) => {
      const option = document.createElement('option');    
      option.value = category.id;
      option.textContent = category.name;
      categorySelected.appendChild(option);
      console.log(option);
      });    
   } 
   catch(error){
      console.error("post failed, cannot find categories");
   }
}

// // Setting submit post button 
// function submitPost () {
//    submitProjectBtn.addEventListener('input', () => {
//       // if( ){
//       // }else(){
//       // };
// });
// }
addFilePage();
toGalleryPage();
addNewProject();
displayModal().then(works => {
console.log(works);  
}).catch(error => {
console.error(error);
});


// const data = {
      //    image: uploadFile.files[0].toDataURL(),
      //    title: inputTitle,
      //    category: categorySelected.category.id,
      // }
      // console.log('post', uploadFile.files[0]);
      // {
      //    image: imageEncodedEnBase64,
      //   Category: LaCategorie,
      //   Title: LeTitre 
      //   }
      // image.toDataURL()