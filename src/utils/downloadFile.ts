export function downloadFile(file: Blob, filename: string) {
  const href = URL.createObjectURL(file);

  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', filename as string);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
