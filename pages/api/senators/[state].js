import jsonLocalsResponse from "../../../lib/jsonLocalsResponse";
import findSenatorsByState from "../../../middleware/findSenatorsByState";
import runMiddleware from "../../../middleware/runMiddleware";

export default async function handler(req, res) {
  await runMiddleware(req, res, findSenatorsByState);

  jsonLocalsResponse(req, res);
}
