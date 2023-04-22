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
  //   mealList.innerHTML = "";
  let searchValue = e.target.value.trim();
  //   let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  //   fetchMealsList(url, value);
  fetchMealApiResults(searchValue);
});

searchBtn.addEventListener("click", (e) => {
  //   console.log(e);

  if (e.key == " " || e.key == "Tab") {
    //if this key's pressed don't search
    return;
  }
  let searchValue = e.target.value;
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
            <div id="card" class="card mb-3 shadow bg-body-tertiary rounded" style="width: 16rem;">
                <img src="${item.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title ">${item.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                        <button type="button" class="btn btn-warning" onclick="showMealDetails(${item.idMeal})">Recipe</button>
                        <button id="main${item.idMeal}" class="btn btn-outline-light " onclick="addRemoveToFavList(${item.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            </div>
            `;
        } else {
          html += `
            <div id="card" class="card mb-4 bg-dark shadow bg-body-tertiary rounded" style="width: 20rem;">
                <img src="${item.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                        <button type="button" class="btn btn-warning" onclick="showMealDetails(${item.idMeal})">Recipe</button>
                        <button id="main${item.idMeal}" class="btn btn-outline-danger" ><i class="fa-regular fa-bookmark fa-lg" style="color: #221f51;"></i></button>
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
