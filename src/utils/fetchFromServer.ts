'use server';

export const fetchFromServer = async (url: string, options: RequestInit) => {
  const response = await fetch(`${process.env.API_URL}${url}`, options);
  const data = await response.json();
  return data;
}