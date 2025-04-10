export const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return 'bg-secondary-darker text-light dark:bg-secondary-lighter dark:text-dark';
    case "draft": return 'bg-gray-300 text-dark dark:bg-gray-300 dark:text-dark';
    case "disabled": return 'bg-red-200 text-dark dark:bg-red-300 dark:text-dark';
    default: return 'bg-gray-300 text-dark';
  }
};