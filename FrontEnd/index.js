
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
// getApiCategories();  //call function
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
// getApiWorks();   //call function
// For treating the callback data
async function fetchData() {
   try {
     const categories = await getApiCategories(); // receive Categories Data  
     const works = await getApiWorks(); // receive Works Data

     // collecting all API Datas therfore retrieving by other function
     updateGallery(works); // calling updateGallery function
     filtreByCategories(categories,works); // calling filreByCategories function 
   } catch (error) {
     console.error('Error fetching data:', error);
   }
}
fetchData(); // calling fetchData function

const gallery = document.querySelector(".gallery");
const galleryId = document.getElementById("galleryid");

// Update portfolio works & gallery
const updateGallery = (works) => {
   console.log(works)
   gallery.innerHTML = '';  // clear actual gallery elements
   works.forEach(work=> {
      const figure = document.createElement("figure");
      const figureImg = document.createElement("img");
      const figcaption = document.createElement("figcaption"); 
      figureImg.src = work.imageUrl;
      figureImg.alt = work.title;
      figure.className = work.categoryId;
      figcaption.innerText = work.title;
      // attatched figure into the gallery
      figure.appendChild(figureImg);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
   });
}

// Classify the works
const filtreByCategories = (categories,works) => {    
   const portfolio = document.getElementById("portfolio");
   const classment = document.createElement('div');
   classment.setAttribute('id','filtres');

   // create the Button 'Tous'
   const buttonTous = document.createElement('button');
   buttonTous.classList.add('filtreBtn');
   buttonTous.innerText = 'Tous';
   buttonTous.setAttribute('id', 'all');
   // attatched the elements
   classment.appendChild(buttonTous);
   portfolio.insertBefore(classment, gallery);

   // use the object Set to retreive only works categorys ID
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
}

// Token status setting for the Admin page
const adminNav = document.getElementById('admin-nav');
const logInOut= document.getElementById('log-in-out');
const titlePortfolio = document.querySelector('.portfolio-title');
const modalButton = document.getElementById('modal-btn');
const filtreSection = document.getElementById('filtres');
const filtreBtn = document.querySelectorAll('.filtreBtn');
let token = localStorage.getItem('token');
console.log('Token value:', token)
console.log(filtreBtn.style)
// token === null ? adminNav.remove() : adminNav.style.display = "block";

if (token===null){
   adminNav.remove();
   modalButton.style.display = "none";
   // filtreSection.style.display = "flex";   
   logInOut.innerHTML="logout";
} else {
   adminNav.style.display = "block";
   modalButton.style.display = "flex";
   // filtreSection.style.display = "none";
   filtreBtn.forEach(btn =>{
      btn.style.display = "none";
   })
   console.log(filtreBtn.style);
}

// function logout(){};




