const axios = require("axios")

const launchesDatabase = require("./launches.mongo")
const planets = require("../planets/planets.mongo")

const launches = new Map()

const DEFAULT_FLIGTH_NUMBER = 100
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1
          }
        }
      ]
    }
  })

  if (response.status !== 200) {
    console.log("Problem Downloading launch")
    throw new Error("Launch data downloading failed")
  }

  const launchDocs = response.data.docs

  for (let launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"]

    const customers = payloads.flatMap((payload) => {
      return payload["customers"]
    })

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      success: launchDoc["success"],
      upcoming: launchDoc["upcoming"],
      customers
    }

    await saveLaunch(launch)
  }
}

async function loadLauncheData() {
  console.log("Downloadind launches data...")

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat"
  })

  if (firstLaunch) {
    console.log("Launch data already exist")
  } else {
    await populateLaunches()
  }
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function getLastFlightNumber() {
  const latestLauch = await launchesDatabase.findOne({}).sort("-flightNumber")

  if (!latestLauch) {
    return DEFAULT_FLIGTH_NUMBER
  }

  return latestLauch.flightNumber
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter)
}

async function checkIfLauchExist(launchId) {
  return await findLaunch({
    flightNumber: launchId
  })
}

async function saveLaunch(launch) {
  try {
    await launchesDatabase.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber
      },
      launch,
      {
        upsert: true
      }
    )
  } catch (error) {
    console.log(`Could not insert launch ${error}`)
  }
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if (!planet) {
    throw new Error("No matching planet found")
  }

  const newFlightNumber = (await getLastFlightNumber()) + 1

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customer: ["BEN", "USA"]
  })

  await saveLaunch(newLaunch)
}

async function abordLauch(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId
    },
    {
      upcoming: false,
      success: false
    }
  )

  return aborted.modifiedCount === 1
}

module.exports = {
  loadLauncheData,
  getAllLaunches,
  checkIfLauchExist,
  scheduleNewLaunch,
  abordLauch
}
