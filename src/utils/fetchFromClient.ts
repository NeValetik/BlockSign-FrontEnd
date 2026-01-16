export const fetchFromClient = async (url: string, options: RequestInit) => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, options);
  console.log(response);
  const data = await response.json();
  return data;
}