import handleWhoIsApi from "../lib/handleWhoIsApi";

export default function findSenatorsByState(req, response, next) {
  const url = `http://whoismyrepresentative.com/getall_sens_bystate.php?state=${req.query.state}&output=json`;

  handleWhoIsApi({ url, response, next });
}
