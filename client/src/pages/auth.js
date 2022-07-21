import React from "react"
import { Appear, Button, Loading, Paragraph } from "arwes"
import Clickable from "../components/Clickable"
import { signInWithGoogle } from "../hooks/requests"

const Auth = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleGoogle = async () => {
    console.log("CLICK")
    await signInWithGoogle()
  }

  return (
    <Appear id="launch" animate show={props.entered}>
      <Paragraph>Loggin</Paragraph>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "inline-grid",
          gridTemplateColumns: "auto auto",
          gridGap: "10px 20px"
        }}
      >
        <label htmlFor="launch-day">email</label>
        <input type="text" id="launch-day" name="email" defaultValue="ben" />

        <label htmlFor="mission-name">Password</label>
        <input type="text" id="mission-name" name="password" />

        <Clickable>
          <Button
            onClick={handleGoogle}
            animate
            show={props.entered}
            type="button"
            layer="success"
            disabled={props.isPendingLaunch}
          >
            Sign in Google
          </Button>
        </Clickable>
        {props.isPendingLaunch && <Loading animate small />}
      </form>
    </Appear>
  )
}

export default Auth
