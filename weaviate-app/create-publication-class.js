const weaviate = require("weaviate-client");

// if you use Docker-compose
const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

// we will create the class "Publication" and the properties
// from the basics section of this guide

var classObj = {
  class: "Publication",
  description:
    "A description of this class, in this case, it is about publications",
  properties: [
    {
      dataType: ["string"],
      description: "The name of the Publication",
      name: "name",
    },
  ],
};

// add the schema
client.schema
  .classCreator()
  .withClass(classObj)
  .do()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

// get and print the schema
client.schema
  .getter()
  .do()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
