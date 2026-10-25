export function formatApaarId(id: string): string {
  if (!id || id.length !== 12) return id;
  return `${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8, 12)}`;
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
