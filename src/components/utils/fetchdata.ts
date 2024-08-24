export async function query(
  api_url: string,
  { method, headers, body }: { method: string; headers?: HeadersInit; body?: string }
) {
  const url = import.meta.env.VITE_API_URL
  try {
    const response = await fetch(`${url}${api_url}`, { method, headers, body })
    const result = await response.json()
    return result
  } catch (e) {
    console.log(e)
  }
}
