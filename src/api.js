
const RECIPES_URL = 'https://dummyjson.com/recipes'

export async function getJSON(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    )
  }

  return await response.json()
}

export async function getRecipes() {
  const data = await getJSON(RECIPES_URL)
  return data.recipes
}
