
export function getUniqueId() {
  const s1 = Math.random().toString(36).substring(2);
  const now = Date.now();
  return `${now}${s1}`;
}


