const weaviate = require("weaviate-client");

// if you use Docker-compose
const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

// we will create the class "Author" and the properties
// from the basics section of this guide
var classObj = {
  class: "Document", // <= note the capital "A".
  description: "Documents are things with text in them",
  properties: [
    {
      dataType: ["string"],
      description: "The title of the Document",
      name: "title",
    },
    {
      dataType: ["text"],
      description: "The content of the document",
      name: "content",
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
