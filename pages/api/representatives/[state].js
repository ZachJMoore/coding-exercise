import jsonLocalsResponse from "../../../lib/jsonLocalsResponse";
import findRepresentativesByState from "../../../middleware/findRepresentativesByState";
import runMiddleware from "../../../middleware/runMiddleware";

export default async function handler(req, res) {
  await runMiddleware(req, res, findRepresentativesByState);

  jsonLocalsResponse(req, res);
}
