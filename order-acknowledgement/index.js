const { google } = require('googleapis')
const fetch = require('node-fetch')

// Service Account JSON file
const { client_email, private_key } = require('./.credentials.json')
const ENDPOINT = 'https://us-central1-prodenv-175112.cloudfunctions.net/fsg-order-status'

const client = new google.auth.JWT({
    email: client_email,
    key: private_key
})

async function acknowledgeOrder({ orderNumber, orderStatusURL }) {
    // Get JWT
    const authToken = await client.fetchIdToken(ENDPOINT)

    /* Call Endpoint with JWT in header, and with a payload of:
    `{
        breakoutId: Int,
        orderStatusURL: String
      }`
    */
    return fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            breakoutId: orderNumber,
            orderStatusURL: orderStatusURL
        }),
    })
}

acknowledgeOrder({ orderNumber: 1234, orderStatusURL: "https://example.com/fsg-order-1234"})
    .then(resp => resp.json())
    .then(resp => console.log(`[SUCCESS]:\n ${JSON.stringify(resp, null, 2)}`))
    .catch(err => console.error(`[ERROR]: \n ${err}`))