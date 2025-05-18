import axios from "axios"

export const getModText = async (id: string) => {
  const { data } = await axios.get(`/api/modText/${id}`)
  return data
}

