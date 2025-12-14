'use server';

export const fetchFromServer = async (url: string, options: RequestInit) => {
  const response = await fetch(`${process.env.API_URL}${url}`, options);
  console.log(response);
  const data = await response.json();
  return data;
}

export const fetchFromServerBlob = async (url: string) => {
  const response = await fetch(`${process.env.API_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/pdf',
    },
  });
  const data = await response.blob();
  return data;
}