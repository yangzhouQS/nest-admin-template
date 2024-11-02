export interface CrudRequest {
  parsed: Record<string, unknown>;
  options: {
    query?: Record<string, unknown>;
    routes?: Record<string, unknown>;
    params?: Record<string, unknown>;
  };
}
