export function getColorFromId(id) {
  const index = (id - 1 ) % 8;
  const colors = ['#dbeafe', '#fee2e2', '#d1fae5', '#fef3c7', '#ede9fe', '#ffedd5', '#fce7f3', '#ccfbf1']
  return colors[index];
}