/**
 * Matches the kb-newspaper-server response envelope exactly, e.g.
 * res.json({ success: true, message: "...", data: article }) or
 * res.json({ success: true, total: N, data: [...] }) — NOT the
 * { data, meta } shape from the earlier (now-superseded) design.
 */
export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
  total?: number
}

export interface ApiListEnvelope<T> {
  success: boolean
  message?: string
  total: number
  data: T[]
}

export interface ApiErrorResponse {
  success: false
  message: string
  error?: string
}
