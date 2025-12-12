import React, { useState, useEffect } from 'react';
import { Task, TaskRequest, TaskPriority } from '../../types';
import { Loading } from '../common/Loading';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setPriority(task.priority);
    }
  }, [task]);

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
  };

  const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  const getPriorityStyle = (p: TaskPriority) => {
    const styles: Record<TaskPriority, string> = {
      LOW: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
      MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
      HIGH: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
      URGENT: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    };
    return styles[p];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="taskTitle" className="label">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          id="taskTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'input-error' : 'input'}
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="taskDescription" className="label">
          Description <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="taskDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input resize-none"
          rows={3}
          placeholder="Add more details..."
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="label">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label">Priority</label>
          <div className="grid grid-cols-2 gap-2">
            {priorities.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  priority === p
                    ? `${getPriorityStyle(p)} ring-2 ring-offset-1 ring-slate-400`
                    : `${getPriorityStyle(p)} opacity-60`
                }`}
                disabled={isLoading}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loading size="sm" />
          ) : task ? (
            'Update Task'
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};
