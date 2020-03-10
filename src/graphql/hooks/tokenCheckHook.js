// Context hook to check Authentication and Authorization
export function tokenCheckHook({ req, res }) {
  const context = {};

  // Verify jwt token
  const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
  const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : undefined;
  context.authUser = token ? verify(token) : undefined;

  return context;
}
