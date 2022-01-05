export default function getRandString (): string {
  return Math.random().toString(36).substring(7);
}
