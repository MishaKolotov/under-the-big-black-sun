export const getAnonId = (): string => {
  const k = 'ubbs_anon_id'
  let v = localStorage.getItem(k)
  if (!v) {
    v = crypto.randomUUID()
    localStorage.setItem(k, v)
  }
  return v
}
