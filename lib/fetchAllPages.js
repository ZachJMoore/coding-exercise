import _ from "lodash";

// The provided url/endpoint must support a "page" query parameter
// The endpoint is expected to return a JSON object with a "results" & "count" keys

// This function is intended to be used with the swapi.dev api
export default async function fetchAllPages(url) {
  const response = await fetch(`${url}`);
  const data = await response.json();
  const totalPages = Math.ceil(data.count / (data.results.length || 10));

  // For this case we are intentionally ignoring the "next" and "previous" links
  // and instead are fetching all pages at once rather than in succession.

  // Build a list of needed pages to fetch
  const pageUrls = [];
  for (let i = 1; i < totalPages; i++) {
    pageUrls.push(`${url}?page=${i + 1}`);
  }

  // Include the initial page and fetch all the others
  const list = await Promise.all([
    data.results,
    ...pageUrls.map(async (url) => {
      const r = await fetch(url);
      const d = await r.json();
      return d.results;
    }),
  ]);

  return _.flatten(list);
}
