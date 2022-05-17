export default function jsonLocalsResponse(req, res) {
  return res.json(res.locals);
}
