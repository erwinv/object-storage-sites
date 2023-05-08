import 'dotenv/config'

import App from '../lib/app.js'

const { PORT } = process.env

const app = App()
app.listen(process.env.PORT)
console.info(`Listening at port: ${PORT}`)
