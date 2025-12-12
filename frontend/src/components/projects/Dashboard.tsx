import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Project } from '../../types';
import { projectService } from '../../services/projectService';
import { ProjectCard } from '../projects/ProjectCard';
import { Loading, CardSkeleton } from '../common/Loading';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { ProjectForm } from '../projects/ProjectForm';
import toast from 'react-hot-toast';
import { 
  PlusIcon, 
  FolderIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (data: { title: string; description?: string }) => {
    setIsSubmitting(true);
    try {
      const newProject = await projectService.createProject(data);
      setProjects([newProject, ...projects]);
      setIsModalOpen(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + p.totalTasks, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.completedTasks, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { 
      name: 'Total Projects', 
      value: totalProjects, 
      icon: FolderIcon,
      color: 'bg-primary-100 text-primary-600',
      gradient: 'from-primary-500 to-primary-600'
    },
    { 
      name: 'Total Tasks', 
      value: totalTasks, 
      icon: ClipboardDocumentListIcon,
      color: 'bg-amber-100 text-amber-600',
      gradient: 'from-amber-500 to-amber-600'
    },
    { 
      name: 'Completed', 
      value: completedTasks, 
      icon: CheckCircleIcon,
      color: 'bg-emerald-100 text-emerald-600',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    { 
      name: 'Progress', 
      value: `${overallProgress}%`, 
      icon: ChartBarIcon,
      color: 'bg-accent-100 text-accent-600',
      gradient: 'from-accent-500 to-accent-600'
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, <span className="text-gradient">{user?.firstName}</span>! 👋
        </h1>
        <p className="text-slate-600 mt-2">
          Here's an overview of your projects and tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="card p-5 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Your Projects</h2>
          <p className="text-sm text-slate-500">Manage and track your projects</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<FolderIcon className="w-8 h-8" />}
            title="No projects yet"
            description="Get started by creating your first project. You can add tasks, track progress, and more."
            action={
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Project
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project, index) => (
            <div
              key={project.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      {projects.length > 6 && (
        <div className="mt-6 text-center">
          <Link
            to="/projects"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all {projects.length} projects →
          </Link>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        size="md"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
