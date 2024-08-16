export async function getData(api_url: string) {
  const url = import.meta.env.VITE_API_URL
  try {
    const response = await fetch(`${url}${api_url}`)
    const result = await response.json()
    return result
  } catch (e) {
    console.log(e)
  }
}
