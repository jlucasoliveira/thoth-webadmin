export function basename(path?: string, delimiter = '/') {
  if (!path) return;

  const paths = path.split(delimiter);
  return paths.pop();
}
