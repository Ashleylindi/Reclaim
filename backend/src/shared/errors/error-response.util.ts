export function formatError(message: string, statusCode: number) {
  return {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}
