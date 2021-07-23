const express = require('express')
const morgan = require('morgan')
const cors = require('cors') // permite solicitudes de otros orígenes nuestro caso era el 3001 y el 300
const app = express() // creamos aplicacion express
const logger = require('./loggerMiddleware')

// la app tiene que utilizar el modulo que esta en express
// soportar la request cuando se pasa un objeto y lo parsee para tenerlo disponible en req.body
app.use(express.json()) // parsear objetos json

app.use(logger)

// middlewhere registra solicitudes http
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :body - '))

// middleware cors: que origen puede acceder a nuestros recursos. Por defecto cualquier origen funcione
app.use(cors())

let personas = [
  {
    name: 'Arto Hellassss',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Elena',
    number: '657115131',
    id: 4
  },
  {
    name: 'Sara',
    number: '646639276',
    id: 5
  }
]

// cuando se haga peticion get - path a la raiz-
// request: contiene toda la informacion de la solicitud http
// response se utiliza para definir como se esponde a la solicitud
app.get('/', (request, response) => {
  response.send('<h1>Hello Worldddd</h1>')
})

app.get('/api/info', (request, response) => {
  const todayTime = new Date()
  const numberOfPersons = personas.length
  response.send(`<h1>Bienvenido a la agenda de telefonos</h1><p>La agenda tiene ${numberOfPersons} personas</p><p>${todayTime}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(personas)
})

// recuperar un segmento del path con :id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const persona = personas.find(person => {
    console.log(person.id, typeof person.id, id, typeof id, person.id === id)
    return person.id === id
  })
  if (persona) {
    response.json(persona)
  } else {
    response.status(404).json({ error: `No existe el numero que buscas con el id ${id}` }).end()
  }
})

// se guardan todas las personas menos la que queremos eliminar
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  personas = personas.filter(person => person.id !== id)
  response.status(204).end()
})

// crear recurso en personas
app.post('/api/persons', (request, response) => {
  const person = request.body // devuelve el objeto
  console.log(person)
  // necesario json.parser

  if (!person || !person.name) { // si no tiene persona o no tiene name o number
    return response.status(400).json({
      error: 'person.name is missing'
    })
  }
  if (!person.number) { // si no tiene persona o no tiene name o number
    return response.status(400).json({
      error: 'person.number is missing'
    })
  }

  const ids = personas.map(person => person.id)
  const maxId = Math.max(...ids)

  const newPerson = {
    name: person.name,
    number: person.number,
    id: maxId + 1
  }

  // ver si existe el nombre en la agenda
  const existName = personas.map(person => person.name).includes(newPerson.name)
  if (existName) { // si no tiene persona o no tiene name o number
    return response.status(400).json({
      error: 'person.name esta repetido'
    })
  } else {
    // personas = personas.concat(newPerson)
    personas = [...personas, newPerson] // añadir nota en lista de personas
    return response.status(201).json(newPerson) // devolver la nueva persona
  }
})

// middlewere cuando no exista ruta de 404
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// va a estar escuchando puerto
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// import http from 'http'   ecmascript moduls

// const http = require('http') // commonJS http nativo de nodejs: para poder crear un nuevo servidor

// a createserver le pasamos 1 parametro: 1 callback, funcion que se va a ejecutar cada vez que le llegue un request (solicitud http)

// la respuesta es un objeto: y tiene varios metodos para que devuelvas  la info que quieras

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true
//   }
// ]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' }) // cabcecer
//   response.end(JSON.stringify(notes))  //para terminar la respuest devuelve
// })

// json.stringify convierte un objeto en cadena de texto

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
