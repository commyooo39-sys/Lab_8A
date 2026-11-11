import { useState } from "react";

const priorityLabels = {
  high: "สำคัญมาก",
  medium: "ปานกลาง",
  low: "ไม่เร่งด่วน",
};

export default function TodoItem({ task, onToggle, onDelete, onUpdateTitle, onTogglePriority }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [editError, setEditError] = useState("");

  function saveTitle(event) {
    event.preventDefault();
    if (!draftTitle.trim()) {
      setEditError("ชื่องานห้ามเว้นว่าง");
      return;
    }

    onUpdateTitle(task.id, draftTitle);
    setIsEditing(false);
    setEditError("");
  }

  function cancelEdit() {
    setDraftTitle(task.title);
    setEditError("");
    setIsEditing(false);
  }

  return (
    <li className={`task-item${task.completed ? " is-completed" : ""}`}>
      <button
        className="task-check"
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `ทำเครื่องหมาย ${task.title} ว่ายังไม่เสร็จ` : `ทำเครื่องหมาย ${task.title} ว่าเสร็จแล้ว`}
        aria-pressed={task.completed}
      >
        {task.completed && <span aria-hidden="true">✓</span>}
      </button>
      {isEditing ? (
        <form className="edit-task-form" onSubmit={saveTitle}>
          <label className="sr-only" htmlFor={`edit-task-${task.id}`}>แก้ไขชื่องาน</label>
          <input
            id={`edit-task-${task.id}`}
            className="edit-task-input"
            type="text"
            value={draftTitle}
            onChange={(event) => {
              setDraftTitle(event.target.value);
              if (editError) setEditError("");
            }}
            maxLength={120}
            autoFocus
          />
          <button className="edit-action save-edit" type="submit">บันทึก</button>
          <button className="edit-action cancel-edit" type="button" onClick={cancelEdit}>ยกเลิก</button>
          {editError && <span className="edit-error" role="alert">{editError}</span>}
        </form>
      ) : (
        <div className="task-content">
          <span className="task-title">{task.title}</span>
          <button
            className={`priority-badge priority-${task.priority}`}
            type="button"
            onClick={() => onTogglePriority(task.id)}
            aria-label={`ระดับความสำคัญ${priorityLabels[task.priority]} กดเพื่อเปลี่ยนระดับ`}
            title="คลิกเพื่อเปลี่ยนระดับความสำคัญ"
          >
            <span aria-hidden="true" />
            {priorityLabels[task.priority]}
          </button>
        </div>
      )}
      {!isEditing && (
        <button
          className="edit-button"
          type="button"
          onClick={() => {
            setDraftTitle(task.title);
            setIsEditing(true);
          }}
          aria-label={`แก้ไขชื่องาน ${task.title}`}
        >
          แก้ไข
        </button>
      )}
      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`ลบงาน ${task.title}`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4.5 6h11M8 6V4.5h4V6m2.5 0-.6 9.5H6.1L5.5 6m2.2 2.5v4.5m4.6-4.5v4.5" />
        </svg>
      </button>
    </li>
  );
}
