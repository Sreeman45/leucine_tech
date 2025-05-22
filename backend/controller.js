import path from 'path';
const todosFile = path.resolve("data", "todos.json");
import fs from 'fs';
export const readTodos = () => {
  if (!fs.existsSync(todosFile)) return [];
  return JSON.parse(fs.readFileSync(todosFile));
};

export const writeTodos = (todos) => {
  fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
};
