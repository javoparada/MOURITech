/* Async function to make a request to the service and get the data */
async function getUsers() {
  const url = 'https://615485ee2473940017efaed3.mockapi.io/assessment';
  try {
    let res = await fetch(url);
    return res.json();
  } catch (error) {
    console.log(error);
  }
}
