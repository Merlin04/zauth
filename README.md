# ZAuth

ZAuth is a simple authentication API that uses local Unix account credentials. It uses JWTs (JSON Web Tokens) to make it easy to integrate into your own application. For those unfamiliar with them, here's how the auth flow works:

1. Client (usually a web browser) sends a request to the server with a username and password.
2. The server checks the username and password against the local Unix account database (`/etc/shadow`).
3. If the username and password are valid, the server returns a signed JWT that includes the username.
4. The client uses the JWT token to make authenticated requests to the application's API.
5. The API uses the ZAuth instance's public key to verify the JWT, making sure that the user is who they claim to be.

ZAuth was created for [the Hacker Zephyr](https://zephyr.hackclub.com/), a hackathon run by [Hack Club](https://hackclub.com/) that took place on a trans-atlantic train in the summer of 2021. I built this because we had very limited access to the internet, so we could not use an external auth API like Auth0 or Firebase Auth, and I thought it would be nice if everyone could just use the accounts they already use to sign into ZephyrNet (our server).

Currently, the ZAuth code is tailored to our hackathon, but it should be easy to adapt it to other use cases (it's primarily just a matter of editing the index page).

## Example usage

For examples of how to use ZAuth, check out [the source of the index (demo) page](/pages/index.tsx) and [the example API](/pages/api/example.ts) or run ZAuth locally and go to the `/` route.