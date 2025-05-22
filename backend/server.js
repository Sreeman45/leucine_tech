import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readTodos,writeTodos } from './controller.js';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = { id: Date.now(), text: req.body.text };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

app.delete('/todos/:id', (req, res) => {
  const todos = readTodos();
  const deleted = todos.filter(todo => todo.id != req.params.id);
  writeTodos(deleted);
  res.json({ success: true });
});

app.post('/summarize', async (req, res) => {

  const todos = readTodos();
   if (!todos.length) return "No todos to summarize.";
  const pending = todos.map((t,i) => `${i+1}. ${t.text}`).join('\n');

  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: `Summarize the following to-do items,it should be precise and shortn:\n${pending}` }] }
      ]
    })
  });
  console.log("generated")
  const geminiJson = await geminiRes.json();
  const summary = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';

  const slackRes = await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: summary })
  });
    console.log("generated")
  if (slackRes.ok) res.json({ success: true });
  else res.status(500).json({ success: false, message: 'Slack failed' });
});

app.listen(5000, () => console.log(`Server running...`));
