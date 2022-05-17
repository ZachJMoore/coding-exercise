import stateList from "./stateList";

const constants = {
  stateList: stateList,
  searchTypes: [
    {
      name: "Representatives",
      url: "api/representatives",
    },
    {
      name: "Senators",
      url: "api/senators",
    },
  ],
};

export default constants;
