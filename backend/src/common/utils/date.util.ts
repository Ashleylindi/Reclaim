export class DateUtil {
  static now(): string {
    return new Date().toISOString();
  }

  static daysBetween(start: Date, end: Date = new Date()): number {
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
