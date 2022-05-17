import fetchAllPages from "../../lib/fetchAllPages";
import _ from "lodash";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const rateLimit = 50;

async function handler(req, res) {
  const allPlanets = await fetchAllPages("https://swapi.dev/api/planets");

  const renamedResidents = await Promise.all(
    allPlanets.map(async (planet, planetIndex) => {
      const residents = await Promise.all(
        planet.residents.map(async (resident, residentIndex) => {
          // Seems the API doesn't like handling so many requests at once and
          // often returns 404 if we blast them all at once, so we'll
          // wait a bit between each request and space them out.
          await delay((planetIndex + residentIndex) * rateLimit);

          const response = await fetch(resident);
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return data.name;
          } else {
            // we've probably got a 404 or some other issue, but it's definitely not the data we wanted,
            // let's just return the url as-is.

            // const text = await response.text();
            // console.log({ text });

            return resident;
          }
        })
      );

      return { ...planet, residents };
    })
  );

  res.status(200).json(renamedResidents);
}

export default handler;
