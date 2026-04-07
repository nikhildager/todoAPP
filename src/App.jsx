import React, { useMemo, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Build a todo app",
      done: false,
      createdAt: new Date().toLocaleString(),
      dueDate: "",
      reminder: false,
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");

  const addTask = () => {
    const value = newTask.trim();
    if (!value) return;

    const task = {
      id: Date.now(),
      text: value,
      done: false,
      createdAt: new Date().toLocaleString(),
      dueDate: dueDate,
      reminder: false,
    };

    setTasks([task, ...tasks]);
    setNewTask("");
    setDueDate("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.done));
  };

  const toggleReminder = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: !task.reminder } : task
      )
    );
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
    setEditingDueDate(task.dueDate || "");
  };

  const saveEdit = () => {
    if (!editingText.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingId
          ? {
              ...task,
              text: editingText.trim(),
              dueDate: editingDueDate,
            }
          : task
      )
    );

    setEditingId(null);
    setEditingText("");
    setEditingDueDate("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingDueDate("");
  };

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((task) => !task.done);
    if (filter === "completed") return tasks.filter((task) => task.done);
    return tasks;
  }, [tasks, filter]);

  const isOverdue = (task) => {
    if (!task.dueDate || task.done) return false;
    const today = new Date();
    const due = new Date(task.dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const remaining = tasks.filter((task) => !task.done).length;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Todo App</h1>
        <p style={styles.subtitle}>
          Add tasks, deadlines, reminders, and edit items.
        </p>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            style={styles.input}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addButton}>
            Add
          </button>
        </div>

        <div style={styles.filterRow}>
          <button onClick={() => setFilter("all")} style={styles.filterButton}>
            All
          </button>
          <button onClick={() => setFilter("active")} style={styles.filterButton}>
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            style={styles.filterButton}
          >
            Completed
          </button>
        </div>

        <div>
          {filteredTasks.length === 0 ? (
            <div style={styles.empty}>No tasks found.</div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} style={styles.taskCard}>
                {editingId === task.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      style={styles.input}
                    />
                    <input
                      type="date"
                      value={editingDueDate}
                      onChange={(e) => setEditingDueDate(e.target.value)}
                      style={{ ...styles.input, marginTop: "8px" }}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <button onClick={saveEdit} style={styles.smallButton}>
                        Save
                      </button>
                      <button onClick={cancelEdit} style={styles.smallButtonAlt}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.taskTop}>
                      <div>
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(task.id)}
                        />{" "}
                        <span
                          style={{
                            textDecoration: task.done ? "line-through" : "none",
                            color: task.done ? "#888" : "#111",
                            fontSize: "16px",
                            fontWeight: "500",
                          }}
                        >
                          {task.text}
                        </span>
                      </div>

                      <div>
                        <button
                          onClick={() => startEdit(task)}
                          style={styles.iconButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleReminder(task.id)}
                          style={styles.iconButton}
                        >
                          {task.reminder ? "Reminder On" : "Reminder Off"}
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div style={styles.meta}>
                      <div>Created: {task.createdAt}</div>
                      <div
                        style={{
                          color: isOverdue(task) ? "red" : "#555",
                          fontWeight: isOverdue(task) ? "bold" : "normal",
                        }}
                      >
                        Due: {task.dueDate || "No deadline"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div style={styles.footer}>
          <span>{remaining} task(s) remaining</span>
          <button onClick={clearCompleted} style={styles.clearButton}>
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "800px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    padding: "24px",
  },
  title: {
    margin: 0,
    marginBottom: "8px",
  },
  subtitle: {
    marginTop: 0,
    color: "#666",
    marginBottom: "20px",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr auto",
    gap: "10px",
    marginBottom: "16px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  },
  addButton: {
    padding: "10px 16px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  filterButton: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  taskCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "12px",
    background: "#fafafa",
  },
  taskTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  meta: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#555",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  iconButton: {
    marginLeft: "8px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "8px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #dc2626",
    background: "#fff",
    color: "#dc2626",
    cursor: "pointer",
  },
  smallButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    marginRight: "8px",
  },
  smallButtonAlt: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
    border: "1px dashed #ccc",
    borderRadius: "12px",
  },
  footer: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
};