
const RECIPES_URL = 'https://dummyjson.com/recipes'
const CUISINES_URL = 'https://dummyjson.com/recipes/tags'

export async function getJSON(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    )
  }

  return await response.json()
}

export async function getRecipesAndCuisines() {
  const [recipesData, cuisinesData] = await Promise.all([
    getJSON(RECIPES_URL),
    getJSON(CUISINES_URL),
  ])

  return {
    recipes: recipesData.recipes,
    cuisines: cuisinesData
      .filter((tag) => tag.type === 'cuisine')
      .map((tag) => tag.name),
  }
}

export async function getRecipes() {
  const data = await getJSON(RECIPES_URL)
  return data.recipes
}
