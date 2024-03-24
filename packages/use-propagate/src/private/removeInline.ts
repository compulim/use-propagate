export default function removeInline<T>(array: T[], ...items: T[]): void {
  for (const item of items) {
    let index;

    while (~(index = array.indexOf(item))) {
      array.splice(index, 1);
    }
  }
}
