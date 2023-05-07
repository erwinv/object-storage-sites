import 'dotenv/config'
import App from '../lib/app'

const { PORT } = process.env

const app = App()
app.listen(process.env.PORT)
console.info(`Listening at port: ${PORT}`)
