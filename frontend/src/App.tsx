
import './App.css'

// File: src/App.tsx
import { useEffect, useState } from "react";

interface Todo {
  id: number;
  text: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [message, setMessage] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:5000/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo) return alert ('please enter todo');
    await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTodo })
    });
    setNewTodo("");
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const summarizeTodos = async () => {
    const res = await fetch("http://localhost:5000/summarize", {
      method: "POST"
    });
    const result = await res.json();
    setMessage(result.success ? "✅ Summary sent to Slack!" : "❌ Failed to send to Slack");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-800">📝 Todo Summary Assistant</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your tasks and summarize them with AI</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-12 ">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow border border-gray-300 rounded-lg py-2 shadow-sm  "
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-2 py-2 rounded-lg shadow hover:bg-blue-700 w-full sm:w-auto cursor-pointer"
          >
            Add Task
          </button>
        </div>

        <ul className="grid gap-3">
          {todos.map((todo) => (
            <div key={todo.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow border">
              <span className="text-gray-700">{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={summarizeTodos}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 w-full sm:w-auto cursor-pointer"
          >
            Summarize & Send to Slack
          </button>
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
}

