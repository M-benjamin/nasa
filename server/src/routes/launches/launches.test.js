const request = require("supertest")
const app = require("../../app")
const { mongoConnect, mongoDisconnect } = require("../../services/mongo")
const VERSION = "/v1"

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect()
  })

  afterAll(async () => {
    await mongoDisconnect()
  })

  describe("Test GET /lauches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get(`${VERSION}/launches`)
        .expect("Content-Type", /json/)
        .expect(200)
    })
  })

  describe("Test POST /launch", () => {
    const completeLaunch = {
      mission: "BEN ALPHA",
      target: "Kepler-296 A f",
      launchDate: "March 20, 2040",
      rocket: "ECHO Experimental"
    }

    const completeLaunchWithoutDate = {
      mission: "BEN ALPHA",
      target: "Kepler-296 A f",
      rocket: "ECHO Experimental"
    }

    const completeLaunchWithBadDate = {
      mission: "BEN ALPHA",
      target: "Kepler-296 A f",
      launchDate: "date",
      rocket: "ECHO Experimental"
    }

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post(`${VERSION}/launches`)
        .send(completeLaunch)
        .expect("Content-Type", /json/)
        .expect(201)

      // > Test date case
      const requestDate = new Date(completeLaunch.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()
      expect(responseDate).toBe(requestDate)

      expect(response.body).toMatchObject(completeLaunchWithoutDate)
    })

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post(`${VERSION}/launches`)
        .send(completeLaunchWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        error: "Missing required launch property"
      })
    })
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post(`${VERSION}/launches`)
        .send(completeLaunchWithBadDate)
        .expect("Content-Type", /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        error: "Invalid launch date"
      })
    })
  })
})
