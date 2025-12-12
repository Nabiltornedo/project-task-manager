import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Project, Task, TaskRequest, ProjectRequest } from '../../types';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { TaskItem } from '../tasks/TaskItem';
import { TaskForm } from '../tasks/TaskForm';
import { ProjectForm } from './ProjectForm';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { EmptyState } from '../common/EmptyState';
import { Loading } from '../common/Loading';
import { formatRelativeDate, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projectId = Number(id);

  const fetchProjectData = useCallback(async () => {
    try {
      const [projectData, tasksData] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getAllTasks(projectId),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  useEffect(() => {
    let result = [...tasks];

    // Apply filter
    switch (filter) {
      case 'pending':
        result = result.filter((t) => !t.completed);
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
      case 'overdue':
        result = result.filter((t) => t.overdue && !t.completed);
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [tasks, filter, searchQuery]);

  const handleCreateTask = async (data: TaskRequest) => {
    setIsSubmitting(true);
    try {
      const newTask = await taskService.createTask(projectId, data);
      setTasks([newTask, ...tasks]);
      setIsTaskModalOpen(false);
      toast.success('Task created successfully!');
      // Refresh project to update progress
      const updatedProject = await projectService.getProjectById(projectId);
      setProject(updatedProject);
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: TaskRequest) => {
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    try {
      const updatedTask = await taskService.updateTask(projectId, selectedTask.id, data);
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(projectId, taskId);
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      const updatedProject = await projectService.getProjectById(projectId);
      setProject(updatedProject);
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(projectId, taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      const updatedProject = await projectService.getProjectById(projectId);
      setProject(updatedProject);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleUpdateProject = async (data: ProjectRequest) => {
    setIsSubmitting(true);
    try {
      const updatedProject = await projectService.updateProject(projectId, data);
      setProject(updatedProject);
      setIsEditProjectModalOpen(false);
      toast.success('Project updated successfully!');
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsSubmitting(true);
    try {
      await projectService.deleteProject(projectId);
      toast.success('Project deleted successfully!');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text="Loading project..." />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = tasks.filter((t) => t.overdue && !t.completed).length;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: tasks.length },
    { key: 'pending', label: 'Pending', count: pendingCount },
    { key: 'completed', label: 'Completed', count: completedCount },
    { key: 'overdue', label: 'Overdue', count: overdueCount },
  ];

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                <ClipboardDocumentListIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {project.title}
                </h1>
                <p className="text-sm text-slate-500">
                  Created {formatDate(project.createdAt)} • Updated {formatRelativeDate(project.updatedAt)}
                </p>
                {project.description && (
                  <p className="text-slate-600 mt-3">{project.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditProjectModalOpen(true)}
              className="btn-secondary"
            >
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn-danger"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center p-4 rounded-xl bg-slate-50">
            <ClipboardDocumentListIcon className="w-6 h-6 mx-auto text-slate-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900">{project.totalTasks}</p>
            <p className="text-xs text-slate-500">Total Tasks</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-50">
            <CheckCircleIcon className="w-6 h-6 mx-auto text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-emerald-700">{project.completedTasks}</p>
            <p className="text-xs text-emerald-600">Completed</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-amber-50">
            <ClockIcon className="w-6 h-6 mx-auto text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
            <p className="text-xs text-amber-600">Pending</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-red-50">
            <ExclamationTriangleIcon className="w-6 h-6 mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold text-red-700">{overdueCount}</p>
            <p className="text-xs text-red-600">Overdue</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <ProgressBar percentage={project.progressPercentage} size="lg" />
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>

      {/* Filters and Search */}
      {tasks.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs text-slate-400">({f.count})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="input pl-10 pr-9 py-2 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100"
              >
                <XMarkIcon className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<ClipboardDocumentListIcon className="w-8 h-8" />}
            title="No tasks yet"
            description="Start adding tasks to track your project progress."
            action={
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="btn-primary"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Task
              </button>
            }
          />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<FunnelIcon className="w-8 h-8" />}
            title="No tasks found"
            description={`No tasks match the current filter${searchQuery ? ` and search "${searchQuery}"` : ''}.`}
            action={
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TaskItem
                task={task}
                onToggle={handleToggleTask}
                onEdit={openEditTask}
                onDelete={handleDeleteTask}
              />
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title={selectedTask ? 'Edit Task' : 'Add New Task'}
        size="md"
      >
        <TaskForm
          task={selectedTask}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeTaskModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        title="Edit Project"
        size="md"
      >
        <ProjectForm
          project={project}
          onSubmit={handleUpdateProject}
          onCancel={() => setIsEditProjectModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-slate-600 mb-6">
            This will permanently delete "{project.title}" and all {project.totalTasks} tasks. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProject}
              className="btn-danger flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loading size="sm" /> : 'Delete Project'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
