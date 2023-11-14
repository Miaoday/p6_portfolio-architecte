// Get the DataSource Categories from the server API
async function getApiCategories() {  
   try {
      // get the Categories
      const getApiCategories = await fetch('http://localhost:5678/api/categories');
      if (!getApiCategories.ok) {
        throw Error('Network response was not ok');
      }
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
      const dataWorks = await getApiWorks.json();
      console.log('Works from API:', dataWorks)
      return dataWorks;
   } catch (error){
      console.log('Fetch works error:', error)
   }
}
getApiWorks();   //call function

// get the DOM elements
const portfolio = document.getElementById("portfolio");
// remove the figure elements from Html
// figures.forEach((figure, index) => {
//    if (index > 0) {
//       figure.remove();
//    }
// });
const gallery = document.querySelector(".gallery");
gallery.id = 'galleryid';
const galleryId = document.getElementById("galleryid");

// // Update portfolio works in gallery
let updateGallery = (works) => {
   
   console.log(works)
   const figures = galleryId.querySelectorAll("figure");
   document.getElementById("galleryid").innerHTML = '';  // clear actual gallery elements

   for (let i=0; i<figures.length; i++) {
      const figure = document.createElement("figure");
      const figureImg = document.createElement("img");
      const figcaption = document.createElement("figcaption"); 
      figureImg.src = works[i].imageUrl;
      figureImg.alt = works[i].title;
      figure.className = works[i].categoryId;
      figcaption.innerText = works[i].title;

      gallery.appendChild(figure);
      figure.appendChild(figureImg);
      figure.appendChild(figcaption);
   }   
}
// updateGallery(works);

// 调用函数并处理返回的数据
async function fetchData() {
   try {
     const categories = await getApiCategories(); // 获取分类数据
     const works = await getApiWorks(); // 获取作品数据
     // 在这里对获取的分类和作品数据进行进一步处理，或传递给其他函数进行操作
     // 例如调用 updateGallery 或其他操作函数进行界面更新等
     updateGallery(works); // 示例调用 updateGallery 函数来更新作品展示
     // ... 其他操作
   } catch (error) {
     console.error('Error fetching data:', error);
   }
 }
 
 // 调用 fetchData 函数来获取并处理数据
 fetchData();





 

 