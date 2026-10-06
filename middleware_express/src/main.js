import app, { initDB } from './app.js'

const PORT = process.env.PORT || 3000

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Ошибка инициализации БД:', err)
  })