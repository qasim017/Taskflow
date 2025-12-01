import { useState, useEffect } from "react";
import axios from "axios";

export default function Home({ setToken }) {
  // STATES
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Personal");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const token = localStorage.getItem("token");

  // FETCH TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const query = statusFilter && statusFilter !== "All" ? `?status=${statusFilter}` : "";
        const res = await axios.get(`/api/tasks${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (token) fetchTasks();
  }, [token, statusFilter]);

  // CREATE / UPDATE TASK
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingTask) {
        res = await axios.patch(
          `/api/tasks/${editingTask._id}`,
          { title, description, dueDate, category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(tasks.map((t) => (t._id === res.data._id ? res.data : t)));
        setEditingTask(null);
      } else {
        res = await axios.post(
          "/api/tasks",
          { title, description, dueDate, category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([res.data, ...tasks]);
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setCategory("Personal");
      setError("");
    } catch (err) {
      setError(err.response?.data.error || "Failed to save task");
    }
  };

  // DELETE TASK
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT TASK
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate.slice(0, 10));
    setCategory(task.category);
  };

  // TOGGLE STATUS
  const toggleStatus = async (task) => {
    let newStatus =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Completed"
        : "Pending";
    try {
      const res = await axios.patch(
        `/api/tasks/${task._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // FILTERED TASKS
  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) =>
      categoryFilter === "All" ? true : task.category === categoryFilter
    );

  return (
    <div className="min-h-screen bg-gray-500 p-6">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-50">TASKFLOW</h1>
          <button
            onClick={handleLogout}
            className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* STATUS FILTER */}
        <div className="mb-4 flex gap-2">
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded text-white ${
                status === "All"
                  ? "bg-gray-700"
                  : status === "Pending"
                  ? "bg-yellow-600"
                  : status === "In Progress"
                  ? "bg-blue-600"
                  : "bg-green-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* CATEGORY FILTER */}
        <div className="mb-4 flex gap-2">
          {["All", "Work", "Personal", "Health"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="px-3 py-1 rounded bg-purple-800 text-white"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TASK FORM */}
        <div className="bg-gray-200 p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTask ? "Edit Task" : "Add Task"}
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
            </select>

            <button
              type="submit"
              className="w-full bg-gray-500 hover:bg-gray-800 text-white py-2 rounded transition"
            >
              {editingTask ? "Update Task" : "Add Task"}
            </button>
          </form>
        </div>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-100 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
        />

        {/* TASK LIST */}
        <div className="space-y-4">
          {filteredTasks.length === 0 && <p>No tasks found.</p>}

          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-200 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p>{task.description}</p>
                <p className="text-gray-500 text-sm">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p className="mt-1">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      task.status === "Completed"
                        ? "bg-green-600"
                        : task.status === "In Progress"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </p>
                      <button
                  onClick={() => toggleStatus(task)}
                  className="mt-2 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-900 transition"
                >
                  Toggle Status
                </button>
                <p className="mt-1">
                  Category:{" "}
                  <span className="px-2 py-1 rounded bg-purple-800 text-white">
                    {task.category}
                  </span>
                </p>
          
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
