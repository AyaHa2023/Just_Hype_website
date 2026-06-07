export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')                    // splits accented letters: é → e + ́
    .replace(/[\u0300-\u036f]/g, '')     // removes the accent marks
    .replace(/[^a-z0-9\s-]/g, '')       // removes anything that's not a letter, number, space, or dash
    .trim()                              // removes leading/trailing spaces
    .replace(/\s+/g, '-')               // replaces spaces with dashes
    .replace(/-+/g, '-')                // collapses multiple dashes into one
}