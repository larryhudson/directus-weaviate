const weaviate = require("weaviate-client");

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const className = "Author";
const prop = {
  dataType: ["Publication"], // <== note how the name of the class is the cross reference
  name: "writesFor",
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
