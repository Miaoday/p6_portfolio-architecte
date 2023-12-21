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
// displayModal().then(works => {
// console.log(works);  
// }).catch(error => {
// console.error(error);
// });

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
   modalGallery.style.display = "none";
   inputModal.style.display = "block";  
   returnBtn.style.visibility = "visible";
});
// }
// Return to Modal Gallery
function returnPage(){
returnBtn.addEventListener("click",() => {
   modalGallery.style.display = "block";
   inputModal.style.display = "none";    
   returnBtn.style.visibility = "hidden";
});
}
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
 
// Add the New Project in Modal Gallery
const modalForm = document.getElementById('modal-form');
const previewFile = document.getElementById('preview-file');
const uploadFile = document.getElementById('input-file');
const inputTitle = document.getElementById('input-file-title');
const categorySelected = document.getElementById('selected-category');
const addFileBtn = document.querySelector('.add-file')

function addNewProject(){
   modalForm.addEventListener("submit",async (event) => {
      console.log(modalForm);

      event.preventDefault();
      const data = new FormData();
      // const postData = new URLSearchParams(prePost);
      // console.log(prePost);      
      // console.log([...postData]);
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
      data.append('image', uploadFile.files[0]);
      data.append('title', inputTitle.value);
      data.append('category', categorySelected.value);
      console.log('image', uploadFile.files[0]);
      console.log('title', inputTitle.value);
      console.log('category', categorySelected.value);

      try {
      const response = await fetch("http://localhost:5678/api/works",{
         method: "POST", 
         body: data,
         headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
         }   
      })

      if (response.ok){         
         // treatFiles();
         // modalForm.reset();
         // returnPage(); 
         alert("New Projec submite successfully");
      }else {
         alert("New Projec submite failed");
      }
      }catch (error) {
         console.error("Erreur :", error);
      }    
   });
   postCategory();
}

// displayModal().then(works => {
//    console.log(works);  
//    }).catch(error => {
//    console.error(error);
//    });

// function uploadImg () {
//1. Clicked to choose the project file to upload (input)
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
      const reader = new FileReader();
      reader.onload = function(e) {
      console.log(e);
         //4. Link the file with <img>
      previewFile.src = e.target.result;
      previewFile.style.visibility = ("visible");
      addFileBtn.style.visibility = ("hidden");
      }
      //3. Preview the file 
      reader.readAsDataURL(input.files[0]);  
      console.log(reader);      
   }
}
// }
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
      
   } catch(error){
      console.error("post failed, cannot find categories");
   }
}

// // Setting submit post button 
function submitPost () {
   submitProjectBtn.addEventListener('input', () => {
      // if( ){
      // }else(){
      // };
});
}
addNewProject();
displayModal().then(works => {
console.log(works);  
}).catch(error => {
console.error(error);
});