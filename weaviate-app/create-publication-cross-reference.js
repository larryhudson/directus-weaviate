const weaviate = require("weaviate-client");

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const className = "Publication";
const prop = {
  dataType: ["Author"], // <== note how the name of the class is the cross reference
  name: "has",
};

client.schema
  .propertyCreator()
  .withClassName(className)
  .withProperty(prop)
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
