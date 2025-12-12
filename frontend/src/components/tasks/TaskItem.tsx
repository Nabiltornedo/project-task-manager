import React from 'react';
import { Task } from '../../types';
import { formatDueDate, getPriorityColor, classNames } from '../../utils/helpers';
import { 
  CheckCircleIcon, 
  TrashIcon, 
  PencilSquareIcon,
  CalendarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={classNames(
        'group p-4 rounded-xl border transition-all duration-200',
        task.completed
          ? 'bg-slate-50 border-slate-200'
          : 'bg-white border-slate-200 hover:border-primary-200 hover:shadow-md'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={classNames(
            'flex-shrink-0 mt-0.5 transition-all duration-200',
            task.completed
              ? 'text-emerald-500'
              : 'text-slate-300 hover:text-primary-500'
          )}
        >
          {task.completed ? (
            <CheckCircleSolidIcon className="w-6 h-6" />
          ) : (
            <CheckCircleIcon className="w-6 h-6" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={classNames(
                'text-sm font-medium transition-all duration-200',
                task.completed
                  ? 'text-slate-400 line-through'
                  : 'text-slate-900'
              )}
            >
              {task.title}
            </h4>
            
            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                title="Edit task"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete task"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={classNames(
                'text-sm mt-1 line-clamp-2',
                task.completed ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center flex-wrap gap-2 mt-3">
            {/* Priority badge */}
            <span
              className={classNames(
                'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                getPriorityColor(task.priority)
              )}
            >
              {task.priority}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span
                className={classNames(
                  'inline-flex items-center gap-1 text-xs',
                  task.overdue && !task.completed
                    ? 'text-red-600'
                    : 'text-slate-500'
                )}
              >
                {task.overdue && !task.completed ? (
                  <ExclamationCircleIcon className="w-3.5 h-3.5" />
                ) : (
                  <CalendarIcon className="w-3.5 h-3.5" />
                )}
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
