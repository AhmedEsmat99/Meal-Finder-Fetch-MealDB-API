let search=document.getElementById('search');
let submit=document.getElementById('submit');
let random=document.getElementById('random');
let mealsEl=document.getElementById('meals');
let resulHeading=document.getElementById('result-heading');
let singleMealEl=document.getElementById('single-meals');


// search meal and fetch from API
function searchMeal(e){
  e.preventDefault();
  // clear single meal
  singleMealEl.innerHTML='';

  // Get search term
  let term = search.value;
  // check for empty
  if(term.trim()){
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        resulHeading.innerHTML=`<h2>Search reslts for ${term}:</h2>`;
        if(data.meals === null){
          resulHeading.innerHTML=`<p>There ar-e not search results.try agin.</p>`;
        }else{
          mealsEl.innerHTML = data.meals
          .map(meal =>`
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}sd</h3>
            </div>
          </div>
            `).join('')
            ;
          }
        });
      search.value='';
  }else{
    alert('enter a search');
  }

}

// fetch meal by id
function getMealByID(mealID){
fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then(res => res.json())
  .then(data => {
    let meal =data.meals[0];
    
    addMealToDom(meal);
  })
}

// fetch random meal 
function randomMeal(){
  // clear meals and heading
  mealsEl.innerHTML='';
  resulHeading.innerHTML='';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
  .then(res => res.json())
  .then(data =>{
    let meal =data.meals[0];

    addMealToDom(meal);
  });
}

// Add meal to dom
function addMealToDom(meal){
  let ingrdients=[];
  for(let i =1; i<= 20; i++){
    if(meal[`strIngredient${i}`]){
      ingrdients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }else{
      break;
    }
  }
  singleMealEl.innerHTML=`
  <div class=single-meal>
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class='single-meal-info'>
      ${meal.strCategory ? `<p>${meal.strCategory}</p>`:''}
      ${meal.strAree ? `<p>${meal.strAree}</p>`:''}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingrdients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>
  `
}

// event  listeners
submit.addEventListener('submit',searchMeal);
random.addEventListener('click',randomMeal);

mealsEl.addEventListener('click',e=>{
  let mealinfo=e.path.find(item =>{
    if(item.classList){
      return item.classList.contains('meal-info');
    }else{
      return false;
    }
  }
  );
  if(mealinfo){
    let mealID = mealinfo.getAttribute('data-mealid');
    getMealByID(mealID);
  }
});