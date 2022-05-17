export default async function handleWhoIsApi({ url, response, next }) {
  let data = null;
  let error = null;

  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await res.json();
    } else {
      // Looks like the text might contain the results, pass along the text value to the handler
      data = await res.text();
    }
  } catch (err) {
    error = err;
  }

  if (error || (typeof data === "string" && data[0] === "<")) {
    let errorMessage = "Invalid request. Please check your state variable.";
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    response.locals = {
      success: false,
      error: errorMessage,
    };

    return next();
  }

  response.locals = {
    success: true,
    results: typeof data === "string" ? JSON.parse(data).results : data,
  };
  next();
}
