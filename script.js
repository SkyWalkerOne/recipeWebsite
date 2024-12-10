document.addEventListener("DOMContentLoaded", () => {
    const recipeForm = document.getElementById("recipe-form");
    const recipeNameInput = document.getElementById("recipe-name");
    const recipeDescriptionInput = document.getElementById("recipe-description");
    const recipeTypeSelect = document.getElementById("recipe-type");
    const recipeImageInput = document.getElementById("recipe-image");
    const searchInput = document.getElementById("search-input");
    const recipeTypeFilterSelect = document.getElementById("recipe-type-filter");
    const recipesContainer = document.getElementById("recipes-container");
    const successMessage = document.getElementById("success-message");
  
    // Модальное окно
    const recipeModal = document.getElementById("recipe-modal");
    const closeModalButton = document.getElementById("close-modal");
    const modalRecipeName = document.getElementById("modal-recipe-name");
    const modalRecipeImage = document.getElementById("modal-recipe-image");
    const modalRecipeDescription = document.getElementById("modal-recipe-description");
    const modalRecipeType = document.getElementById("modal-recipe-type");
  
    // Загружаем рецепты из localStorage при загрузке страницы
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    let ratings = JSON.parse(localStorage.getItem('ratings')) || {};
  
    if (recipeForm) {
      // Додати рецепт
      recipeForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const name = recipeNameInput.value.trim();
        const description = recipeDescriptionInput.value.trim();
        const type = recipeTypeSelect.value;
        const imageFile = recipeImageInput.files[0];
  
        if (name && description && type) {
          const reader = new FileReader();
          reader.onload = function () {
            const imageSrc = reader.result;
            const newRecipe = { name, description, type, imageSrc };
            recipes.push(newRecipe);
            ratings[name] = 0; // Ініціалізуємо рейтинг для нового рецепту
            alert("Рецепт додано!");
            saveRecipesToLocalStorage();
            clearForm();
            displayRecipes();
          };
          if (imageFile) {
            reader.readAsDataURL(imageFile);
          } else {
            const newRecipe = { name, description, type, imageSrc: null };
            recipes.push(newRecipe);
            ratings[name] = 0; // Ініціалізуємо рейтинг для нового рецепту
            alert("Рецепт додано!");
            saveRecipesToLocalStorage();
            clearForm();
            displayRecipes();
          }
        }
      });
    }
  
    if (searchInput) {
      // Пошук рецепту
      searchInput.addEventListener("input", () => {
        displayRecipes();
      });
    }
  
    if (recipeTypeFilterSelect) {
      // Фільтрація за типом рецепту
      recipeTypeFilterSelect.addEventListener("change", () => {
        displayRecipes();
      });
    }
  
    // Очистити форму
    function clearForm() {
      recipeNameInput.value = "";
      recipeDescriptionInput.value = "";
      recipeTypeSelect.value = "";
      recipeImageInput.value = "";
    }
  
    // Функция для сокращения описания
    function truncateDescription(description) {
      const maxLength = 200;
      if (description.length > maxLength) {
        return description.slice(0, maxLength) + '...'; // Обрезаем и добавляем многоточие
      }
      return description;
    }
  
    // Відобразити рецепти
    function displayRecipes() {
      const filterText = searchInput.value.trim().toLowerCase();
      const selectedType = recipeTypeFilterSelect.value;
  
      recipesContainer.innerHTML = "";
  
      const filteredRecipes = recipes.filter(recipe => {
        const matchesName = recipe.name.toLowerCase().includes(filterText);
        const matchesType = selectedType ? recipe.type === selectedType : true;
        return matchesName && matchesType;
      });
  
      filteredRecipes.forEach((recipe) => {
        const li = document.createElement("li");
        li.classList.add("recipe-item");
  
        const img = document.createElement("img");
        img.src = recipe.imageSrc || "https://via.placeholder.com/100";
        img.alt = recipe.name;
  
        const details = document.createElement("div");
        details.classList.add("recipe-details");
  
        // Сокращаем описание, если оно длинное
        const truncatedDescription = truncateDescription(recipe.description);
  
        details.innerHTML = `
          <strong>${recipe.name}</strong>
          <p>${truncatedDescription}</p>
          <p class="recipe-type">Тип: ${recipe.type}</p>
        `;
  
        li.appendChild(img);
        li.appendChild(details);
  
        // Добавляем событие на клик по рецепту
        li.addEventListener("click", () => {
          openRecipeModal(recipe);
        });
  
        recipesContainer.appendChild(li);
      });
    }
  
    // Открытие модального окна с информацией о рецепте
    function openRecipeModal(recipe) {
      modalRecipeName.textContent = recipe.name;
      modalRecipeImage.src = recipe.imageSrc || "https://via.placeholder.com/300";
      modalRecipeDescription.textContent = recipe.description;
      modalRecipeType.textContent = `Тип: ${recipe.type}`;
  
      recipeModal.style.display = "block"; // Показываем модальное окно
    }
  
    // Закрытие модального окна
    closeModalButton.addEventListener("click", () => {
      recipeModal.style.display = "none";
    });
  
    // Закрытие модального окна при клике вне его
    window.addEventListener("click", (e) => {
      if (e.target === recipeModal) {
        recipeModal.style.display = "none";
      }
    });
  
    // Зберегти рецепти в localStorage
    function saveRecipesToLocalStorage() {
      localStorage.setItem('recipes', JSON.stringify(recipes));
      saveRatingsToLocalStorage(); // Зберігаємо рейтинги окремо
    }
  
    // Зберегти рейтинги в localStorage
    function saveRatingsToLocalStorage() {
      localStorage.setItem('ratings', JSON.stringify(ratings));
    }
  
    // Ініціалізація
    displayRecipes();
  });
  