import Joi from "joi";
import fetchAllPages from "../../lib/fetchAllPages";
import validateParameters from "../../validation/validateParameters";
import _ from "lodash";

function fixNumber(value) {
  return parseInt(`${value}`.replace(",", ""));
}

async function handler(req, res) {
  const { sortBy, sortDirection } = req.query;

  const allPeople = await fetchAllPages("https://swapi.dev/api/people");
  const normalized = allPeople.map((person) => {
    // parseInt doesn't like commas. Also helps with the sorting below to convert to numbers first.
    person.height = fixNumber(person.height);
    person.mass = fixNumber(person.mass);
    return person;
  });

  res.status(200).json(_.orderBy(normalized, sortBy, sortDirection));
}

const schema = Joi.object({
  sortBy: Joi.string().valid("name", "height", "mass").default("name"),
  sortDirection: Joi.string().valid("asc", "desc").default("asc"),
});

export default validateParameters({ query: schema }, handler);
