import { useEffect, useMemo, useState } from "react";
import TodoFilter from "./components/TodoFilter.jsx";
import TodoList from "./components/TodoList.jsx";

const STORAGE_KEY = "smart-todo-tasks";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState("all");
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const counts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  }), [tasks]);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    }),
    [filter, tasks],
  );

  function addTask(event) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) {
      setError("กรุณาพิมพ์ชื่องานก่อนเพิ่ม");
      return;
    }

    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        title,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...currentTasks,
    ]);
    setTaskTitle("");
    setError("");
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )));
  }

  function updateTaskTitle(taskId, title) {
    const updatedTitle = title.trim();
    if (!updatedTitle) return false;

    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, title: updatedTitle } : task
    )));
    return true;
  }

  function toggleTaskPriority(taskId) {
    const priorities = ["high", "medium", "low"];
    setTasks((currentTasks) => currentTasks.map((task) => {
      if (task.id !== taskId) return task;
      const currentIndex = priorities.indexOf(task.priority);
      return { ...task, priority: priorities[(currentIndex + 1) % priorities.length] };
    }));
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed));
  }

  const today = new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Smart Todo หน้าหลัก">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span>smart<span className="brand-light">todo</span></span>
        </a>
        <span className="header-date">{today}</span>
      </header>

      <main className="page-content">
        <section className="page-intro" aria-labelledby="page-title">
          <p className="eyebrow">พื้นที่เล็ก ๆ สำหรับวันที่มีประสิทธิภาพ</p>
          <h1 id="page-title">จัดการวันของคุณ<span className="title-dot">.</span></h1>
          <p className="intro-copy">ค่อย ๆ ทำทีละอย่าง แล้วทุกอย่างจะสำเร็จ</p>
        </section>

       

        <section className="composer-card" aria-labelledby="add-task-title">
          <div className="composer-heading">
            <div className="composer-icon" aria-hidden="true">＋</div>
            <div>
              <h2 id="add-task-title">เพิ่มงานใหม่</h2>
              <p>มีอะไรที่อยากทำให้สำเร็จวันนี้?</p>
            </div>
          </div>
          <form id="task-form" onSubmit={addTask}>
            <label className="sr-only" htmlFor="task-title">ชื่องาน</label>
            <input
              id="task-title"
              type="text"
              value={taskTitle}
              onChange={(event) => {
                setTaskTitle(event.target.value);
                if (error) setError("");
              }}
              placeholder="เช่น อ่านหนังสือบทที่ 3"
              maxLength={120}
            />
            <label className="sr-only" htmlFor="task-priority">ระดับความสำคัญ</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="high">สำคัญมาก</option>
              <option value="medium">ปานกลาง</option>
              <option value="low">ไม่เร่งด่วน</option>
            </select>
            <button className="add-button" type="submit">เพิ่มงาน <span aria-hidden="true">↗</span></button>
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>
        </section>

        <section className="tasks-card" aria-labelledby="tasks-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ทำให้สำเร็จทีละข้อ</p>
              <h2 id="tasks-title">รายการของฉัน</h2>
            </div>
            <span className="task-count">{counts.all} งาน</span>
          </div>
          <TodoFilter activeFilter={filter} counts={counts} onChange={setFilter} />
          <TodoList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdateTitle={updateTaskTitle}
            onTogglePriority={toggleTaskPriority}
          />
          {counts.completed > 0 && (
            <button className="clear-button" type="button" onClick={clearCompleted}>
              ล้างงานที่เสร็จแล้ว
            </button>
          )}
        </section>
        <footer className="page-footer">ทำทีละนิด ก็เข้าใกล้เป้าหมายได้ทุกวัน <span aria-hidden="true">✦</span></footer>
      </main>
    </div>
  );
}
