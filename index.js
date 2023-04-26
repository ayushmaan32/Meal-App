// accessing variables
const searchBar = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

const mealList = document.getElementById("mealList");
const favMealList = document.getElementById("favMealList");

const favourites = document.getElementById("favourites");

// Intialise LocalStorage
const storage = window.localStorage;

if (storage.getItem("favouritesList") == null) {
  storage.setItem("favouritesList", JSON.stringify([]));
}

//displaying results on the basis of searchresults from an API Call and adding it to the DOM
async function displayMealList() {
  let html = "";
  const value = searchBar.value.trim();
  console.log(value);
  let localArray = JSON.parse(storage.getItem("favouritesList"));

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
    );

    data = await response.json();
    console.log(data);
    // if (value.length < 2) {
    //   data.meals = 1;
    // }
  } catch (err) {
    console.error(err);
  }
  console.log(data.meals);

  if (data.meals) {
    console.log(data);
    data.meals.forEach((items) => {
      let isFav = false;
      for (let i = 0; i < localArray.length; i++) {
        if (localArray[i] == items.idMeal) {
          isFav = true;
        }
      }
      if (isFav) {
        html += `
              <div id="card" class="card mb-3" style="width: 20rem;">
                  <img src="${items.strMealThumb}" class="card-img-top" alt="...">
                  <div class="card-body">
                      <h5 class="card-title ">${items.strMeal}</h5>
                      <div class="d-flex justify-content-between mt-5">
                          <button type="button" class="btn btn-warning" onclick="displayMealDetails(${items.idMeal})">Recipe</button>
                          <button id="main${items.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${items.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                      </div>
                  </div>
              </div>
              `;
      } else {
        html += `
              <div id="card" class="card mb-4" style="width: 20rem;">
                  <img src="${items.strMealThumb}" class="card-img-top" alt="...">
                  <div class="card-body">
                      <h5 class="card-title">${items.strMeal}</h5>
                      <div class="d-flex justify-content-between mt-5">
                          <button type="button" class="btn btn-warning" onclick="displayMealDetails(${items.idMeal})">Recipe</button>
                          <button id="main${items.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${items.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                      </div>
                  </div>
              </div>
              `;
      }
    });
  } else {
    html += `
          <div class="page-wrap d-flex flex-row align-items-center">
              <div class="container">
                  <div class="row justify-content-center">
                      <div class="col-md-12 text-center" ">
                          <div class="mb-4 lead black">
                              The meal you are looking for is not found.
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          `;
  }
  mealList.innerHTML = html;
}

// function to show Meal details
async function displayMealDetails(id) {
  console.log(id);
  let html = "";
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  console.log(data);

  if (data) {
    html += ` <div class="container py-3">
    <div class="card  p-lg-5 p-md-2">
        <div class="row ">
            <div class="col-md-4  align-self-center" id= "photo">
                <img src="${data.meals[0].strMealThumb}" class="w-100 ">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <h2 class="card-title" id="heading">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>
                    <h5>Instruction :</h5>
                    <p class="card-text" id="instructions">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}"  target="_blank" class="btn btn-warning">Video</a> 
                </div>
            </div>
        </div>
    </div>
</div>`;
  }

  mealList.innerHTML = html;
}

// function to show favourite meal list
async function showFavMealList() {
  console.log("hello");
  let html = "";
  let localArray = JSON.parse(storage.getItem("favouritesList"));
  console.log(localArray);
  if (localArray.length > 0) {
    for (let i = 0; i < localArray.length; i++) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${localArray[i]}`
      );
      const data = await response.json();

      if (data) {
        html += `
         <div id="card" class="card mb-3 shadow bg-body-tertiary rounded" style="width: 20rem;">
         <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
         <div class="card-body">
             <h5 class="card-title ">${data.meals[0].strMeal}</h5>
             <div class="d-flex justify-content-between mt-5">
                 <button type="button" class="btn btn-warning" onclick="displayFavMealDetails(${data.meals[0].idMeal})">Recipe</button>
                 <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light " onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
             </div>
         </div>
     </div>
        `;

        favMealList.innerHTML = html;
      }
    }
  } else {
    html += ` 
   <div class="page-wrap d-flex flex-row align-items-center">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 text-center" ">
                <div class="mb-4 lead black">
                    No Favourite meals added
                </div>
            </div>
        </div>
    </div>
   </div>`;

    favMealList.innerHTML = html;
  }
}

// function to show favourite meal details
async function displayFavMealDetails(id) {
  console.log(id);
  let html = "";
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  console.log(data);

  if (data) {
    html += ` <div class="container py-3">
    <div class="card  p-lg-5 p-md-2">
        <div class="row ">
            <div class="col-md-4  align-self-center" id= "photo">
                <img src="${data.meals[0].strMealThumb}" class="w-100 ">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <h2 class="card-title" id="heading">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>
                    <h5>Instruction :</h5>
                    <p class="card-text" id="instructions">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}"  target="_blank" class="btn btn-warning">Video</a> 
                </div>
            </div>
        </div>
    </div>
</div>`;
  }

  favMealList.innerHTML = html;
}

// function to add and remove favourite items

function addRemoveToFavList(id) {
  let localArray = JSON.parse(storage.getItem("favouritesList"));
  let contain = false;
  for (let i = 0; i < localArray.length; i++) {
    if (id == localArray[i]) {
      contain = true;
    }
  }
  if (contain) {
    let num = localArray.indexOf(id);
    localArray.splice(num, 1);
    alert("your meal has been removed from favourites list");
  } else {
    localArray.push(id);
    alert("your meal added to your favourites list");
  }
  storage.setItem("favouritesList", JSON.stringify(localArray));

  showFavMealList();
  displayMealList();
}
