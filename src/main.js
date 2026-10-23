
import './style.css'
import { getRecipes } from './api.js'

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
      <p id="status" class="text-slate-700">Loading recipes...</p>

      <div
        id="recipes"
        class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      ></div>
    </section>
  </main>
`

async function loadRecipes() {
  const status = document.querySelector('#status')
  const recipesContainer = document.querySelector('#recipes')

  try {
    const recipes = await getRecipes()

    status.textContent = `Loaded ${recipes.length} recipes successfully!`

    recipesContainer.innerHTML = recipes.map(
      ({ id, name, image, cuisine, difficulty, rating }) => `
        <article class="rounded-xl bg-white p-4 shadow-sm">
          <img
            src="${image}"
            alt="${name.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}"
            class="h-48 w-full rounded-lg object-cover"
          >

          <h2 class="mt-3 text-lg font-bold text-slate-900">
            ${name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </h2>

          <p class="mt-2 text-sm text-slate-600">
            Cuisine: ${cuisine}
          </p>

          <p class="mt-1 text-sm text-slate-600">
            Difficulty: ${difficulty}
          </p>

          <p class="mt-2 font-semibold text-orange-600">
            ⭐ ${rating}
          </p>
        </article>
      `
    ).join('')
  } catch (error) {
    status.textContent = `Could not load recipes: ${error.message}`
  }
}

loadRecipes()
