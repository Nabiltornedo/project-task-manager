import { format, formatDistanceToNow, parseISO, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDueDate = (dateString: string | null): string => {
  if (!dateString) return 'No due date';
  
  const date = parseISO(dateString);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isPast(date)) return `Overdue: ${format(date, 'MMM d')}`;
  
  return format(date, 'MMM d, yyyy');
};

export const isDueDatePast = (dateString: string | null): boolean => {
  if (!dateString) return false;
  return isPast(parseISO(dateString));
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'COMPLETED': 'text-emerald-600',
    'ALMOST_DONE': 'text-sky-600',
    'IN_PROGRESS': 'text-amber-600',
    'STARTED': 'text-orange-600',
    'NOT_STARTED': 'text-slate-500',
    'NO_TASKS': 'text-slate-400',
  };
  return colors[status] || 'text-slate-500';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'URGENT': 'bg-red-100 text-red-700 border-red-200',
    'HIGH': 'bg-orange-100 text-orange-700 border-orange-200',
    'MEDIUM': 'bg-amber-100 text-amber-700 border-amber-200',
    'LOW': 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return colors[priority] || 'bg-slate-100 text-slate-600';
};

export const getPriorityBgColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'URGENT': 'bg-red-500',
    'HIGH': 'bg-orange-500',
    'MEDIUM': 'bg-amber-500',
    'LOW': 'bg-slate-400',
  };
  return colors[priority] || 'bg-slate-400';
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return 'bg-emerald-500';
  if (percentage >= 75) return 'bg-sky-500';
  if (percentage >= 50) return 'bg-amber-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

export const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
