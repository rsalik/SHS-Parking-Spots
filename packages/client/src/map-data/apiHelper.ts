export async function getTakenSpots() {
  let res = await fetch('http://localhost:3001/taken-spots');
  return await res.json();
}
