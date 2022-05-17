import handleWhoIsApi from "../lib/handleWhoIsApi";

export default function findRepresentativesByState(req, response, next) {
  const url = `http://whoismyrepresentative.com/getall_reps_bystate.php?state=${req.query.state}&output=json`;

  handleWhoIsApi({ url, response, next });
}
