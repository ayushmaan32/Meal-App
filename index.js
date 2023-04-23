const searchBar = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

const mealList = document.getElementById("mealList");

const favourites = document.getElementById("favourites");

// Intialise LocalStorage
const storage = window.localStorage;

if (storage.getItem("favouritesList") == null) {
  storage.setItem("favouritesList", JSON.stringify([]));
}

searchBar.addEventListener("keyup", (e) => {
  console.log(e);

  if (e.key == " " || e.key == "Tab") {
    //if this key's pressed don't search
    return;
  }
  let searchValue = e.target.value.trim();

  fetchMealApiResults(searchValue);
});

searchBtn.addEventListener("click", () => {
  let searchValue = searchBar.value.trim();
  fetchMealApiResults(searchValue);
});

//displaying results on the basis of searchresults from an API Call and adding it to the DOM
let displayMealList = (meals) => {
  let html = "";
  console.log(meals);
  let localArray = JSON.parse(storage.getItem("favouritesList"));
  if (meals === null) {
    mealList.innerHTML = "<h1> No Meal Availaible With This Name</h1>";
  } else if (meals === 1) {
    mealList.innerHTML = "<h1>Please Enter Atleast 2 Characters</h1>";
  } else {
    if (meals) {
      meals.forEach((item) => {
        let isFav = false;
        for (let index = 0; index < localArray.length; index++) {
          if (arr[index] == item.idMeal) {
            isFav = true;
          }
        }
        if (isFav) {
          html += `
            <div id="card" class="card mb-3 shadow bg-body-tertiary rounded" style="width: 20rem;">
                <img src="${item.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title ">${item.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                        <button type="button" class="btn btn-warning" onclick="showMealDetails(${item.idMeal})">Recipe</button>
                        <button id="main${item.idMeal}" class="btn btn-outline-light " onclick="RemoveToFavList(${item.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            </div>
            `;
        } else {
          html += `
            <div id="card" class="card mb-4 bg-dark shadow bg-body-tertiary rounded" style="width: 20rem;">
                <img src="${item.strMealThumb}" class="card-img-top" alt="..." >
                <div class="card-body">
                    <h5 class="card-title">${item.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                        <button type="button" class="btn btn-warning" onclick="showMealDetails(${item.idMeal})">Recipe</button>
                        <button id="main${item.idMeal}" class="btn btn-outline-danger"   onclick="addToFavList(${item.idMeal})" ><i class="fa-regular fa-bookmark fa-lg" style="color: #221f51;"></i></button>
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
                            The meal you are looking for was not found.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    mealList.innerHTML = html;
  }
};

//Making api call and getting results on the basis of key typed
let fetchMealApiResults = async (searchValue) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
    );

    data = await response.json();
    console.log(data);
    if (searchValue.length < 2) {
      data.meals = 1;
    }
    displayMealList(data.meals);
  } catch (err) {
    console.error(err);
  }
};

// function to show Meal details
async function showMealDetails(id) {
  let html = "";
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();

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
  let html = "";
  let localArray = JSON.parse(storage.getItem("favouritesList"));
  if (localArray.length > 0) {
    for (let i = 0; i < localArray.length; i++) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${arr[i]}`
      );
      const data = await response.json();

      if (data) {
        html += `
         <div id="card" class="card mb-3 shadow bg-body-tertiary rounded" style="width: 20rem;">
         <img src="${item.strMealThumb}" class="card-img-top" alt="...">
         <div class="card-body">
             <h5 class="card-title ">${item.strMeal}</h5>
             <div class="d-flex justify-content-between mt-5">
                 <button type="button" class="btn btn-warning" onclick="showMealDetails(${item.idMeal})">Recipe</button>
                 <button id="main${item.idMeal}" class="btn btn-outline-light " onclick="RemoveToFavList(${item.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
             </div>
         </div>
     </div>
        `;

        mealList.innerHTML = html;
      }
    }
  } else {
    html += ` 
   <div class="page-wrap d-flex flex-row align-items-center">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 text-center" ">
                <div class="mb-4 lead black">
                    No Favourite meals
                </div>
            </div>
        </div>
    </div>
   </div>`;

    mealList.innerHTML = html;
  }
}
