const weaviate = require("weaviate-client");

// if you use Docker-compose
const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

// we will create the class "Author" and the properties
// from the basics section of this guide
var classObj = {
  class: "Author", // <= note the capital "A".
  description: "A description of this class, in this case, it is about authors",
  properties: [
    {
      dataType: ["string"],
      description: "The name of the Author",
      name: "name",
    },
    {
      dataType: ["int"],
      description: "The age of the Author",
      name: "age",
    },
    {
      dataType: ["date"],
      description: "The date of birth of the Author",
      name: "born",
    },
    {
      dataType: ["boolean"],
      description: "A boolean value if the Author won a nobel prize",
      name: "wonNobelPrize",
    },
    {
      dataType: ["text"],
      description: "A description of the author",
      name: "description",
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
