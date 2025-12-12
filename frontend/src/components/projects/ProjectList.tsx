import React, { useState, useEffect } from 'react';
import { Project, ProjectRequest } from '../../types';
import { projectService } from '../../services/projectService';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { CardSkeleton } from '../common/Loading';
import toast from 'react-hot-toast';
import { 
  PlusIcon, 
  FolderIcon, 
  MagnifyingGlassIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (data: ProjectRequest) => {
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

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="input pl-11 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100"
              >
                <XMarkIcon className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<FolderIcon className="w-8 h-8" />}
            title="No projects yet"
            description="Get started by creating your first project to organize your tasks."
            action={
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Project
              </button>
            }
          />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<MagnifyingGlassIcon className="w-8 h-8" />}
            title="No results found"
            description={`No projects match "${searchQuery}". Try a different search term.`}
            action={
              <button
                onClick={() => setSearchQuery('')}
                className="btn-secondary"
              >
                Clear Search
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
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
