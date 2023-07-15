const weaviate = require("weaviate-client");
const fs = require("fs");

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

async function getJsonData() {
  return await fs.promises
    .readFile("./data.json", { encoding: "utf-8" })
    .then(JSON.parse);
}

async function importPublications() {
  // Get the data from the data.json file
  const data = await getJsonData();

  // Prepare a batcher
  let batcher = client.batch.objectsBatcher();
  let counter = 0;

  data.publications.forEach((publication) => {
    // Construct an object with a class, id, properties and vector
    const obj = {
      class: "Publication",
      id: publication.id,
      properties: {
        name: publication.name,
      },
      // vector: publication.vector,
    };

    // add the object to the batch queue
    batcher = batcher.withObject(obj);

    // When the batch counter reaches 20, push the objects to Weaviate
    if (counter++ == 20) {
      // flush the batch queue
      batcher
        .do()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });

      // restart the batch queue
      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  });

  // Flush the remaining objects
  batcher
    .do()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

importPublications();

async function importAuthors() {
  // Get the data from the data.json file
  const data = await getJsonData();

  // Prepare a batcher
  let batcher = client.batch.objectsBatcher();
  let counter = 0;

  // Loop through all authors and import them
  data.authors.forEach((author) => {
    // Construct an object with a class, id, properties and vector
    const obj = {
      class: "Author",
      id: author.id,
      properties: {
        name: author.name,
        age: author.age,
        born: author.born,
        wonNobelPrize: author.wonNobelPrize,
        description: author.description,
      },
      // vector: author.vector,
    };

    // add the object to the batch queue
    batcher = batcher.withObject(obj);

    // When the batch counter reaches 20, push the objects to Weaviate
    if (counter++ == 20) {
      // flush the batch queue (use await to execute the promise)
      let result = await(batcher.do());
      console.log(`Batch loaded: ${JSON.stringify(result)}`);

      // restart the batch queue
      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  });

  // Flush the remaining objects
  await batcher
    .do()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

// importAuthors();
