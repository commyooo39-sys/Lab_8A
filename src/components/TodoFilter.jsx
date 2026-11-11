const filters = [
  { id: "all", label: "ทั้งหมด" },
  { id: "active", label: "กำลังทำ" },
  { id: "completed", label: "เสร็จแล้ว" },
];

export default function TodoFilter({ activeFilter, counts, onChange }) {
  return (
    <div className="todo-filters" role="group" aria-label="กรองรายการงาน">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-button${activeFilter === filter.id ? " is-active" : ""}`}
          type="button"
          onClick={() => onChange(filter.id)}
          aria-pressed={activeFilter === filter.id}
        >
          {filter.label}
          <span>{counts[filter.id]}</span>
        </button>
      ))}
    </div>
  );
}
