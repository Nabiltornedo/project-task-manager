import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { formatRelativeDate, getStatusColor, truncateText } from '../../utils/helpers';
import { 
  FolderIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusText = () => {
    if (project.totalTasks === 0) return 'No tasks';
    if (project.progressPercentage === 100) return 'Completed';
    if (project.progressPercentage >= 75) return 'Almost done';
    if (project.progressPercentage >= 50) return 'In progress';
    if (project.progressPercentage > 0) return 'Started';
    return 'Not started';
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className="card-hover group block"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <FolderIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
              {project.title}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Created {formatRelativeDate(project.createdAt)}
            </p>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {truncateText(project.description, 100)}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <ClipboardDocumentListIcon className="w-4 h-4" />
            <span>{project.totalTasks} tasks</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircleIcon className="w-4 h-4" />
            <span>{project.completedTasks} done</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar percentage={project.progressPercentage} size="sm" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className={`text-sm font-medium ${getStatusColor(
            project.progressPercentage === 100 ? 'COMPLETED' :
            project.progressPercentage >= 75 ? 'ALMOST_DONE' :
            project.progressPercentage >= 50 ? 'IN_PROGRESS' :
            project.progressPercentage > 0 ? 'STARTED' :
            project.totalTasks === 0 ? 'NO_TASKS' : 'NOT_STARTED'
          )}`}>
            {getStatusText()}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
            View project
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
