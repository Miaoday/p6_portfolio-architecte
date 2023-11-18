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
getApiCategories();  //call function

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
getApiWorks();   //call function

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
gallery.id = 'galleryid';
const galleryId = document.getElementById("galleryid");

// Update portfolio works & gallery
const updateGallery = (works) => {
   console.log(works)
   // const figures = galleryId.querySelectorAll("figure");
   // document.getElementById("galleryid").innerHTML = '';
   gallery.innerHTML = '';  // clear actual gallery elements

   // for (let i=0; i<figures.length; i++) {
   works.forEach(work=> {
      const figure = document.createElement("figure");
      const figureImg = document.createElement("img");
      const figcaption = document.createElement("figcaption"); 
      // figureImg.src = works[i].imageUrl;
      // figureImg.alt = works[i].title;
      // figure.className = works[i].categoryId;
      // figcaption.innerText = works[i].title;
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
   classment.classList.add('filtres');

   // create the Button 'Tous'
   const buttonTous = document.createElement('button');
   buttonTous.classList.add('filtreBtn');
   buttonTous.innerText = 'Tous';
   buttonTous.setAttribute('id', 'all');
   // attatched the elements
   classment.appendChild(buttonTous);
   portfolio.insertBefore(classment, gallery);

   // use the object Set to retreive only works categorys ID
   const uniqueSetOfWorks = new Set(works.map(work => work.categoryId)); 

   // Create catogorys buttons 
   uniqueSetOfWorks.forEach(categoryId => {
      const btn = document.createElement('button');
      const category = categories.find(cat => cat.id === categoryId);
      btn.classList.add('filtreBtn');
      btn.innerText = category ? category.name : 'Unknown Category';
      btn.setAttribute('id', categoryId);
      // attatched the elements
      classment.appendChild(btn);

      btn.addEventListener('click', function() {
         console.log('Button clicked')
         const categoryIdN = parseInt(this.getAttribute('id'));
         const worksFiltres = works.filter(work => work.categoryId === categoryIdN);
         
         console.log('Works filtered:', worksFiltres); 
         document.getElementById("galleryid").innerHTML = '';
         updateGallery(worksFiltres);        
      });
   });

   // click the button 'Tous'
   buttonTous.addEventListener('click', function() {
      updateGallery(works);
   }); 
}
//    // click the button 'Tous'
//    buttonTous.addEventListener('click', function() {
//       console.log ('id:', all)
//       updateGallery(works);
//    }); 
   
//    // create other categories buttons
//    for (let i=0; i < categories.length; i++) {
//       const btn = document.createElement('button');
//       btn.classList.add('filtreBtn');
//       btn.innerText = categories[i].name;
//       btn.setAttribute('id', categories[i].id);
//       classment.appendChild(btn);
      
//       // click the other categories buttons
//       btn.addEventListener('click', function() {       
//          const categoryIdN = parseInt(this.getAttribute('id'));

//          const worksFiltres = works.filter(function(work) {
            
//             return work.categoryId === categoryIdN;
//          })
//       document.getElementById("galleryid").innerHTML = '';
//       filtreByCategories(worksFiltres);
//       });
//    };
// }

