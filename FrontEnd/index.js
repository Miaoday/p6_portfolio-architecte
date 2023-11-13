// Get the DataSource from the server API
async function getAPI() {  
   try {
      // get the Categories
      const getCategories = await fetch('http://localhost:5678/api/categories');
      if (!getCategories.ok) {
        throw Error('Network response was not ok');
      }
      const dataCatagories = await getCategories.json();
      console.log('Categories from API:', dataCatagories)
   }  catch (error) {
      console.log('Fetch error:', error)
   }
   // get the Works
   const getWorks = await fetch('http://localhost:5678/api/works');
   if (!getWorks.ok) {
      throw Error('Works request failed');
   }
   const dataWorks = await getWorks.json();
   console.log('Works from API:', dataWorks)
   // get the DOM elements
   const portfolio = document.getElementById('portfolio');
   const gallery = document.querySelector('.gallery'); 
   const figures = gallery.querySelectorAll('figure');
   console.log('Figures:', figures)
   console.log ('Figures Length:',figures.length);
   console.log('Processing data and DOM elements...');

    // remove all the figure elements except the first one
    figures.forEach((figure, index) => {
      if (index > 0) {
         figure.remove();
      }
   });
}
// Get the gallery element
getAPI();




 

 