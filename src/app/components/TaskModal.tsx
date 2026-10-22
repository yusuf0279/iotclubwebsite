// src/app/components/TaskModal.tsx
'use client';

import React, { useState } from 'react';
import { Member, RoleCategory, Priority } from '@/lib/types';

interface TaskModalProps {
  members: Member[];
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: RoleCategory;
    assigneeId: number;
    dueDate: string;
    points: number;
    priority: Priority;
    checklistText: string;
  }) => void;
}

const CATEGORIES: RoleCategory[] = [
 'General',
 'Technical',
 'Activities',
 'Public Relations',
 'Media',
 'Executives',
];

export default function TaskModal({ members, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoleCategory>('Technical');
  const [assigneeId, setAssigneeId] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState(100);
  const [priority, setPriority] = useState<Priority>('medium');
  const [checklistText, setChecklistText] = useState('');

  // Helper to check if a member belongs to a committee category
  const memberMatchesCategory = (member: Member, cat: RoleCategory) => {
    if (cat === 'General') return true; // Anyone can be assigned General tasks
    if (Array.isArray(member.category)) {
      return member.category.includes(cat);
    }
    return member.category === cat;
  };

  // Dynamically filter members based on selected category
  const filteredMembers = members.filter((m) => memberMatchesCategory(m, category));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    // Default to first eligible member if none selected
    const selectedAssignee = assigneeId || (filteredMembers[0] ? filteredMembers[0].id : members[0]?.id || 1);

    onSubmit({
      title,
      category,
      assigneeId: selectedAssignee,
      dueDate,
      points: Number(points),
      priority,
      checklistText,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg  flex items-center justify-center p-4">
      <div className="bg-surface border border-divider rounded-none w-full max-w-lg p-6  space-y-4">
        <div className="flex justify-between items-center border-b border-divider pb-3">
          <h2 className="text-[20px] font-bold text-text">Create New Task</h2>
          <button onClick={onClose} className="text-muted hover:text-text text-[16px]">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[14px]">
          <div>
            <label className="block text-muted mb-1 font-medium">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Build ESP32 Firmware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg border border-divider rounded-none px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-muted mb-1 font-medium">Committee Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as RoleCategory;
                  setCategory(newCat);
                  // Reset assigneeId to first eligible member of new category
                  const eligible = members.filter((m) => memberMatchesCategory(m, newCat));
                  if (eligible.length > 0) {
                    setAssigneeId(eligible[0].id);
                  }
                }}
                className="w-full bg-bg border border-divider rounded-none px-3 py-2 text-text focus:outline-none focus:border-accent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">
                Assignee ({filteredMembers.length})
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(Number(e.target.value))}
                className="w-full bg-bg border border-divider rounded-none px-3 py-2 text-text focus:outline-none focus:border-accent"
              >
                {filteredMembers.length === 0 ? (
                  <option value={0}>No members in this committee</option>
                ) : (
                  filteredMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-muted mb-1 font-medium">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-bg border border-divider rounded-none px-3 py-2 text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full bg-bg border border-divider rounded-none px-3 py-2 text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-bg border border-divider rounded-none px-3 py-2 text-text focus:outline-none focus:border-accent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-muted mb-1 font-medium">
              Checklist (comma-separated items)
            </label>
            <input
              type="text"
              placeholder="e.g., Review schematic, Order parts, Test circuit"
              value={checklistText}
              onChange={(e) => setChecklistText(e.target.value)}
              className="w-full bg-bg border border-divider rounded-none px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-2 hover:bg-surface-2 text-text rounded-none transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:opacity-90 text-on-accent font-medium rounded-none transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}