const API_URL = "https://localhost:8000/v1"
// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`)
  return await response.json()
}

// Load planets and return as JSON.
async function signInWithGoogle() {
  try {
    const response = await fetch(`${API_URL}/auth/google`)
    console.log("RES ==>", response)
    return await response.json()
  } catch (error) {
    console.log("ERROR::", error)
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const fetchedLaunches = await response.json()
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(launch)
    })
  } catch (error) {
    return {
      ok: false
    }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    })
  } catch (error) {
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
  signInWithGoogle
}
