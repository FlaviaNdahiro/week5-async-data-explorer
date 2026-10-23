
import './style.css'
import { getRecipesAndCuisines } from './api.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="min-h-screen bg-orange-50 p-6">
    <header class="mx-auto max-w-7xl">
      <p class="text-sm font-semibold uppercase tracking-widest text-orange-600">
        Week 5 Project
      </p>
      <h1 class="mt-2 text-4xl font-bold text-slate-900">
        Recipes Explorer
      </h1>
      <p class="mt-2 text-slate-600">
        Discover delicious recipes from around the world.
      </p>
    </header>

    <section class="mx-auto mt-8 max-w-7xl">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block font-medium text-slate-700">
            Search recipes
          </span>
          <input
            id="search"
            type="search"
            placeholder="Search by recipe name..."
            class="w-full rounded-lg border border-orange-200 bg-white p-3"
          >
        </label>

        <label class="block">
          <span class="mb-1 block font-medium text-slate-700">
            Filter by cuisine
          </span>
          <select
            id="cuisine"
            class="w-full rounded-lg border border-orange-200 bg-white p-3"
          >
            <option value="">All cuisines</option>
          </select>
        </label>
      </div>

      <label class="mt-4 block">
        <span class="mb-1 block font-medium text-slate-700">
          Sort recipes
        </span>
        <select
          id="sort"
          class="w-full rounded-lg border border-orange-200 bg-white p-3"
        >
          <option value="name">Name (A–Z)</option>
          <option value="rating">Rating (highest first)</option>
        </select>
      </label>

      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-600">Total recipes</p>
          <p id="total-recipes" class="mt-2 text-3xl font-bold text-orange-600">0</p>
        </div>

        <div class="rounded-xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-600">Average rating</p>
          <p id="average-rating" class="mt-2 text-3xl font-bold text-orange-600">0</p>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <p id="status" role="status" aria-live="polite" class="text-slate-700">
          Loading recipes...
        </p>
        <button
          id="clear"
          type="button"
          class="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white"
        >
          Clear filters
        </button>
      </div>

      <div
        id="recipes"
        class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      ></div>
    </section>

    <div
      id="recipe-modal"
      class="fixed inset-0 z-50 hidden overflow-y-auto bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="mx-auto my-8 max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div class="flex items-center justify-between gap-4">
          <h2 id="modal-title" class="text-2xl font-bold text-slate-900">
            Recipe details
          </h2>
          <button
            id="close-modal"
            type="button"
            class="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800"
            aria-label="Close recipe details"
          >
            Close
          </button>
        </div>
        <div id="modal-content" class="mt-4"></div>
      </div>
    </div>
  </main>
`

const state = {
  recipes: [],
  search: '',
  cuisine: '',
  sort: 'name',
}

const searchInput = document.querySelector('#search')
const cuisineSelect = document.querySelector('#cuisine')
const sortSelect = document.querySelector('#sort')
const status = document.querySelector('#status')
const recipesContainer = document.querySelector('#recipes')
const totalRecipesElement = document.querySelector('#total-recipes')
const averageRatingElement = document.querySelector('#average-rating')
const modal = document.querySelector('#recipe-modal')
const modalContent = document.querySelector('#modal-content')
const closeModalButton = document.querySelector('#close-modal')

function renderStatistics() {
  const totalRecipes = state.recipes.length

  const totalRating = state.recipes.reduce(
    (sum, recipe) => sum + recipe.rating,
    0
  )

  const averageRating = totalRecipes > 0
    ? (totalRating / totalRecipes).toFixed(1)
    : '0'

  totalRecipesElement.textContent = totalRecipes
  averageRatingElement.textContent = averageRating
}

function renderRecipes() {
  const filteredRecipes = state.recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(state.search.toLowerCase())

    const matchesCuisine =
      !state.cuisine || recipe.cuisine === state.cuisine

    return matchesSearch && matchesCuisine
  })

  const sortedRecipes = filteredRecipes.toSorted((a, b) => {
    if (state.sort === 'rating') {
      return b.rating - a.rating
    }

    return a.name.localeCompare(b.name)
  })

  status.textContent =
    `Showing ${sortedRecipes.length} of ${state.recipes.length} recipes`

  if (sortedRecipes.length === 0) {
    recipesContainer.innerHTML = `
      <p class="rounded-xl bg-white p-6 text-slate-600 sm:col-span-2 lg:col-span-3">
        No recipes found. Try another search or cuisine.
      </p>
    `
    return
  }

  recipesContainer.innerHTML = sortedRecipes.map(
    ({ id, image, rating }) => `
      <article
        class="recipe-card cursor-pointer rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        data-id="${id}"
        tabindex="0"
        role="button"
        aria-label="View recipe details"
      >
        <img
          src="${image}"
          alt="Recipe"
          class="h-48 w-full rounded-lg object-cover"
          loading="lazy"
        >
        <h2 class="mt-3 text-lg font-bold text-slate-900"></h2>
        <p class="mt-2 text-sm text-slate-600"></p>
        <p class="mt-1 text-sm text-slate-600"></p>
        <p class="mt-2 font-semibold text-orange-600">⭐ ${rating}</p>
        <p class="mt-3 text-sm font-semibold text-orange-700">
          Click to see details →
        </p>
      </article>
    `
  ).join('')

  sortedRecipes.forEach((recipe, index) => {
    const card = recipesContainer.children[index]

    card.querySelector('h2').textContent = recipe.name
    card.querySelectorAll('p')[0].textContent =
      `Cuisine: ${recipe.cuisine}`
    card.querySelectorAll('p')[1].textContent =
      `Difficulty: ${recipe.difficulty}`
  })
}

function openRecipeDetails(recipeId) {
  const recipe = state.recipes.find(
    (item) => item.id === Number(recipeId)
  )

  if (!recipe) return

  modalContent.replaceChildren()

  const image = document.createElement('img')
  image.src = recipe.image
  image.alt = recipe.name
  image.className = 'h-56 w-full rounded-xl object-cover'

  const summary = document.createElement('p')
  summary.className = 'mt-3 text-slate-600'
  summary.textContent =
    `${recipe.cuisine} cuisine • ${recipe.difficulty} • ⭐ ${recipe.rating}`

  const time = document.createElement('p')
  time.className = 'mt-2 text-slate-700'
  time.textContent =
    `Preparation: ${recipe.prepTimeMinutes} minutes | Cooking: ${recipe.cookTimeMinutes} minutes`

  const servings = document.createElement('p')
  servings.className = 'mt-2 text-slate-700'
  servings.textContent = `Servings: ${recipe.servings}`

  const ingredientsTitle = document.createElement('h3')
  ingredientsTitle.className = 'mt-5 text-lg font-bold text-slate-900'
  ingredientsTitle.textContent = 'Ingredients'

  const ingredientsList = document.createElement('ul')
  ingredientsList.className = 'mt-2 list-disc space-y-1 pl-6 text-slate-700'

  recipe.ingredients.forEach((ingredient) => {
    const item = document.createElement('li')
    item.textContent = ingredient
    ingredientsList.append(item)
  })

  const instructionsTitle = document.createElement('h3')
  instructionsTitle.className = 'mt-5 text-lg font-bold text-slate-900'
  instructionsTitle.textContent = 'Instructions'

  const instructionsList = document.createElement('ol')
  instructionsList.className = 'mt-2 list-decimal space-y-2 pl-6 text-slate-700'

  recipe.instructions.forEach((instruction) => {
    const item = document.createElement('li')
    item.textContent = instruction
    instructionsList.append(item)
  })

  modalContent.append(
    image,
    summary,
    time,
    servings,
    ingredientsTitle,
    ingredientsList,
    instructionsTitle,
    instructionsList
  )

  modal.classList.remove('hidden')
  document.body.classList.add('overflow-hidden')
  closeModalButton.focus()
}

function closeRecipeDetails() {
  modal.classList.add('hidden')
  document.body.classList.remove('overflow-hidden')
}

async function loadRecipes() {
  try {
    status.textContent = 'Loading recipes...'
    recipesContainer.innerHTML = ''

    const data = await getRecipesAndCuisines()
    state.recipes = data.recipes

    renderStatistics()

    cuisineSelect.innerHTML = '<option value="">All cuisines</option>'

    data.cuisines.forEach((cuisine) => {
      const option = document.createElement('option')
      option.value = cuisine
      option.textContent = cuisine
      cuisineSelect.append(option)
    })

    renderRecipes()
  } catch (error) {
    status.textContent = `Could not load recipes: ${error.message}`

    recipesContainer.innerHTML = `
      <div class="rounded-xl bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-3">
        <p class="font-semibold text-red-600">
          Something went wrong while loading recipes.
        </p>
        <p class="mt-2 text-slate-600">
          Please check your internet connection and try again.
        </p>
        <button
          id="retry"
          type="button"
          class="mt-4 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white"
        >
          Retry
        </button>
      </div>
    `

    document.querySelector('#retry').addEventListener('click', loadRecipes)
  }
}

searchInput.addEventListener('input', (event) => {
  state.search = event.target.value.trim()
  renderRecipes()
})

cuisineSelect.addEventListener('change', (event) => {
  state.cuisine = event.target.value
  renderRecipes()
})

sortSelect.addEventListener('change', (event) => {
  state.sort = event.target.value
  renderRecipes()
})

document.querySelector('#clear').addEventListener('click', () => {
  state.search = ''
  state.cuisine = ''
  state.sort = 'name'

  searchInput.value = ''
  cuisineSelect.value = ''
  sortSelect.value = 'name'

  renderRecipes()
})

recipesContainer.addEventListener('click', (event) => {
  const card = event.target.closest('.recipe-card')

  if (card) {
    openRecipeDetails(card.dataset.id)
  }
})

recipesContainer.addEventListener('keydown', (event) => {
  const card = event.target.closest('.recipe-card')

  if (card && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    openRecipeDetails(card.dataset.id)
  }
})

closeModalButton.addEventListener('click', closeRecipeDetails)

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeRecipeDetails()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeRecipeDetails()
  }
})

loadRecipes()
