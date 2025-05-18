import { getModText } from '@/utils/dynamo';
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = string
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // get the id from the request
  const { id } = req.query;
  // check if the id is set
  if (!id || Array.isArray(id)) {
    res.status(400)
    return;
  }

  const modtext = await getModText(id)

  if (!modtext) {
    res.status(404).send("Mod text not found")
    return;
  }

  res.status(200).send(modtext)
}