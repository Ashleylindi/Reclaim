export function formatDate(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
