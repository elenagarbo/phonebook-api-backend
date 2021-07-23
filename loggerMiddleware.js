// middlewhere info request
const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next() // ve a la siguiente ruta para ver si tienes que ejecutarte
}

module.exports = logger
