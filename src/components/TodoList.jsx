import TodoItem from "./TodoItem.jsx";

export default function TodoList({ tasks, onToggle, onDelete, onUpdateTitle, onTogglePriority }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">✦</span>
        <p>ยังไม่มีงานในรายการนี้</p>
        <span>เพิ่มงานใหม่ด้านบน แล้วเริ่มลงมือกันเลย</span>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTitle={onUpdateTitle}
          onTogglePriority={onTogglePriority}
        />
      ))}
    </ul>
  );
}
