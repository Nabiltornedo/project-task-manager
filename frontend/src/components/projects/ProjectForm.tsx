import React, { useState, useEffect } from 'react';
import { Project, ProjectRequest } from '../../types';
import { Loading } from '../common/Loading';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description || '');
    }
  }, [project]);

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="label">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'input-error' : 'input'}
          placeholder="Enter project title"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${errors.description ? 'input-error' : 'input'} resize-none`}
          rows={4}
          placeholder="Describe your project..."
          disabled={isLoading}
        />
        <div className="flex justify-between mt-1.5">
          {errors.description ? (
            <p className="text-sm text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${description.length > 900 ? 'text-amber-500' : 'text-slate-400'}`}>
            {description.length}/1000
          </span>
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
          ) : project ? (
            'Update Project'
          ) : (
            'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};
