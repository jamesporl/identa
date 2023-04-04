export default function getPageTitle(title?: string) {
  if (!title) {
    return 'IDENTA - Better Dental Practice';
  }
  return `${title} - IDENTA`;
}
