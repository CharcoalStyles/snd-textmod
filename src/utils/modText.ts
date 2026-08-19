export const getModText = async (id: number): Promise<string | null> => {
  const res = await fetch(`/api/modText/${id}`);
  if (!res.ok) return null;
  return res.json();
};
