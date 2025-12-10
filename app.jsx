import React, { useEffect, useState } from "react";

// Simplified version — filtering removed, bugs fixed, cleaner state management.

// Types
 type Status = "Not Started" | "In Progress" | "Done";

type Task = {
  id: string;
  day: string;
  title: string;
  status: Status;
  notes?: string;
  date?: string;
};

const STORAGE_KEY = "pims_onboarding_tasks_v2";

const initialTasks: Task[] = [
  // Day 1
  { id: "t-1", day: "Day 1 — Core Understanding", title: "Run Angular project successfully", status: "Not Started" },
  { id: "t-2", day: "Day 1 — Core Understanding", title: "Review app-routing.module.ts", status: "Not Started" },
  { id: "t-3", day: "Day 1 — Core Understanding", title: "Understand layout.module.ts", status: "Not Started" },
  { id: "t-4", day: "Day 1 — Core Understanding", title: "Study api-endpoint.ts", status: "Not Started" },
  { id: "t-5", day: "Day 1 — Core Understanding", title: "Study http.service.ts", status: "Not Started" },
  { id: "t-6", day: "Day 1 — Core Understanding", title: "Understand auth.guard.ts / role.guard.ts", status: "Not Started" },

  // Day 2
  { id: "t-7", day: "Day 2 — Employee Module Deep Dive", title: "Understand employee-list component", status: "Not Started" },
  { id: "t-8", day: "Day 2 — Employee Module Deep Dive", title: "Understand employee-details component", status: "Not Started" },
  { id: "t-9", day: "Day 2 — Employee Module Deep Dive", title: "Review employee.service.ts", status: "Not Started" },
  { id: "t-10", day: "Day 2 — Employee Module Deep Dive", title: "Trace API calls UI → Service → Backend", status: "Not Started" },

  // Day 3
  { id: "t-11", day: "Day 3 — Shared Components", title: "Study shared data-table component", status: "Not Started" },
  { id: "t-12", day: "Day 3 — Shared Components", title: "Review shared form components", status: "Not Started" },
  { id: "t-13", day: "Day 3 — Shared Components", title: "Study directives (access-control, validation)", status: "Not Started" },

  // Day 4
  { id: "t-14", day: "Day 4 — Permissions & Menu", title: "Review permission.ts", status: "Not Started" },
  { id: "t-15", day: "Day 4 — Permissions & Menu", title: "Study menu.ts structure", status: "Not Started" },
  { id: "t-16", day: "Day 4 — Permissions & Menu", title: "Study menu.service.ts logic", status: "Not Started" },
  { id: "t-17", day: "Day 4 — Permissions & Menu", title: "Understand dynamic sidebar rendering", status: "Not Started" },

  // Day 5
  { id: "t-18", day: "Day 5 — Authentication Flow", title: "Study sign-in.component.ts", status: "Not Started" },
  { id: "t-19", day: "Day 5 — Authentication Flow", title: "Study auth.service.ts", status: "Not Started" },
  { id: "t-20", day: "Day 5 — Authentication Flow", title: "Study token-interceptor.service.ts", status: "Not Started" },

  // Day 6
  { id: "t-21", day: "Day 6 — Secondary Modules", title: "Explore setup module: district, designation, cadre", status: "Not Started" },
  { id: "t-22", day: "Day 6 — Secondary Modules", title: "Explore user & role modules", status: "Not Started" },
  { id: "t-23", day: "Day 6 — Secondary Modules", title: "Understand SEC module patterns", status: "Not Started" },

  // Day 7
  { id: "t-24", day: "Day 7 — First Contribution", title: "Fix a small UI/UX bug", status: "Not Started" },
  { id: "t-25", day: "Day 7 — First Contribution", title: "Improve validation or loaders", status: "Not Started" },
  { id: "t-26", day: "Day 7 — First Contribution", title: "Remove unused imports + cleanup", status: "Not Started" },
  { id: "t-27", day: "Day 7 — First Contribution", title: "Submit your first PR", status: "Not Started" }
];

function uid(prefix="t"){
  return `${prefix}-${Math.random().toString(36).slice(2,9)}`;
}

export default function PIMSChecklistApp(){
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if(saved) return JSON.parse(saved);
    } catch(err){ console.error(err); }
    return initialTasks;
  });

  const [newTitle, setNewTitle] = useState("");
  const [newDay, setNewDay] = useState("Day 1 — Core Understanding");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const days = Array.from(new Set(tasks.map(t => t.day)));

  const setStatus = (id: string, status: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? {
      ...t,
      status,
      date: status === "Done" ? (t.date || new Date().toISOString().slice(0,10)) : undefined
    } : t));
  };

  const updateNotes = (id: string, notes: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, notes } : t));
  };

  const updateDate = (id: string, date?: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, date } : t));
  };

  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const addTask = () => {
    if(!newTitle.trim()) return;
    setTasks(prev => [
      { id: uid(), day: newDay, title: newTitle.trim(), status: "Not Started" },
      ...prev
    ]);
    setNewTitle("");
  };

  const doneCount = tasks.filter(t => t.status === "Done").length;
  const percent = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold">PIMS Checklist (Simplified)</h1>
        <p className="text-slate-500 text-sm mb-4">No filters. No clutter. Just your progress.</p>

        {/* Add task */}
        <div className="flex gap-2 mb-4">
          <input className="flex-1 border rounded px-2 py-1" placeholder="New task title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <select className="border rounded px-2 py-1" value={newDay} onChange={e => setNewDay(e.target.value)}>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={addTask} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="bg-slate-200 h-3 rounded overflow-hidden">
            <div className="bg-green-500 h-full" style={{width:`${percent}%`}} />
          </div>
          <p className="text-right text-sm text-slate-600 mt-1">{percent}% complete</p>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="p-3 border rounded flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50">
              <div className="flex-1">
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-slate-500">{task.day}</div>
                <div className="mt-2 text-sm text-slate-700">{task.notes || <span className="text-slate-400">No notes</span>}</div>
              </div>

              <div className="flex items-center gap-2">
                <select className="border rounded px-2 py-1" value={task.status} onChange={e => setStatus(task.id, e.target.value as Status)}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>

                <input type="date" className="border rounded px-2 py-1" value={task.date || ""} onChange={e => updateDate(task.id, e.target.value)} />

                <button className="px-2 py-1 border rounded" onClick={() => {
                  const note = prompt("Edit notes", task.notes || "");
                  if(note !== null) updateNotes(task.id, note);
                }}>Notes</button>

                <button onClick={() => removeTask(task.id)} className="px-2 py-1 bg-red-600 text-white rounded">X</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// <-- paste your single JSX file here
const App = () => {
  return <h1>Hello from GitHub Pages!</h1>;
};
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
