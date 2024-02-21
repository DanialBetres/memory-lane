require('dotenv').config()
const express = require('express')
const sqlite3 = require('sqlite3')
const OpenAI = require('openai')

const app = express()
const port = 4001
const db = new sqlite3.Database('memories.db')

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
})

const getTags = async (text) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant. The user will submit a memory that they would like to remember. The format will include the name of the memory as well as a description of the memory. You will analyze the memory and output a list of tags to tag the memory with in json format. The tags should not be a single word that exists in the memory itself. Think more around categorizing the memory into buckets.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
  })
  const tags = JSON.parse(chatCompletion.choices[0].message.content)

  return tags.tags
}

app.use(express.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      tags TEXT,
      pictures TEXT,
      timestamp DATE
    )
  `)
})

app.get('/memories', (req, res) => {
  db.all('SELECT * FROM memories', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    rows.forEach((row) => {
      row.tags = JSON.parse(row.tags)
      row.pictures = JSON.parse(row.pictures)
    })
    res.json({ memories: rows })
  })
})

app.post('/memories', async (req, res) => {
  const { name, description, pictures, timestamp } = req.body
  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const tags = await getTags(`name: ${name}, description: ${description}`)

  const stmt = db.prepare(
    'INSERT INTO memories (name, description, tags, pictures, timestamp) VALUES (?, ?, ?, ?, ?)'
  )
  stmt.run(
    name,
    description,
    JSON.stringify(tags),
    JSON.stringify(pictures),
    timestamp,
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.status(201).json({ message: 'Memory created successfully' })
    }
  )
})

app.get('/memories/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Memory not found' })
      return
    }

    row.tags = JSON.parse(row.tags)
    row.pictures = JSON.parse(row.pictures)
    res.json({ memory: row })
  })
})

app.put('/memories/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, timestamp } = req.body

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const tags = await getTags(`name: ${name}, description: ${description}`)

  const stmt = db.prepare(
    'UPDATE memories SET name = ?, description = ?, tags = ?, timestamp = ? WHERE id = ?'
  )
  stmt.run(name, description, JSON.stringify(tags), timestamp, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory updated successfully' })
  })
})

app.delete('/memories/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory deleted successfully' })
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
