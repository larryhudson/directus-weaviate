from flask import Flask, render_template, request, url_for, redirect, jsonify
from gpt_index import GPTSimpleVectorIndex, Document, download_loader
from gpt_index.readers import SimpleWebPageReader
from gpt_index.langchain_helpers.text_splitter import TokenTextSplitter
import os
from datetime import datetime
import requests
from pathlib import Path

app = Flask(__name__)

def get_latest_index_file():
    index_files = [filename for filename in os.listdir('.') if filename.startswith("index_")]

    if index_files:
        print(index_files)

        index_filename = sorted(index_files)[-1]
        print(index_filename)
        return index_filename
    else:
        return None

def get_timestamp():
    dt = datetime.now()
    ts = datetime.timestamp(dt)

    return str(int(ts))

def get_index_timestamp_filename():
    timestamp = get_timestamp()

    return f'index_{timestamp}.json'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/query')
def query():
    query_string = request.args.get('q')
    

    index_filename = get_latest_index_file()
    index = GPTSimpleVectorIndex.load_from_disk(index_filename)

    response = index.query(query_string)
    print(response)

    should_return_json = request.args.get('format') == 'json'
    if should_return_json:
        # this might be a thing?
        return jsonify({
            'query': query_string,
            'response': response
        })
    else:
        return render_template('query.html', query=query_string, response=response)




# Route for adding a document download (eg. a PDF, Word doc) from Directus
@app.route('/add-document-from-url', methods=['POST'])
def add_document_from_url():
    # Example URL: http://localhost:8000/add-url?url=https%3A%2F%2Fwebaim.org%2Fintro%2F
    # Get the URL to add from the 'url' search param


    DIRECTUS_ACCESS_TOKEN = os.getenv('DIRECTUS_ACCESS_TOKEN')

    download_url = request.json.get('download_url') # this is the Directus URL
    download_filename = download_url.split('/')[-1] # this is the filename (eg. bd4240e4-5bb7-4027-90f1-c1b0b030656f.pdf)
    download_url_with_token = f'{download_url}?access_token={DIRECTUS_ACCESS_TOKEN}' # this is the URL with the access token added on

    print("Adding document", download_url)

    # download the file to a new data directory
    # data_directory_name = f'data_import_{get_timestamp()}'
    # os.mkdir(data_directory_name)

    UnstructuredReader = download_loader("UnstructuredReader")
    loader = UnstructuredReader()

    downloads_dir = 'downloads'
    download_path = os.path.join(downloads_dir, download_filename)

    with open (download_path, "wb") as f:
        f.write(requests.get(download_url_with_token).content)

    # load our existing index.
    # if no existing file, create a new index

    index_filename = get_latest_index_file()

    if index_filename:
        index = GPTSimpleVectorIndex.load_from_disk(index_filename)
    else:
        index = GPTSimpleVectorIndex([])

    # add our new document
    documents = loader.load_data(file=Path(download_path), split_documents=True)


    # Split up the document into chunks. Followed these docs: https://github.com/jerryjliu/gpt_index/blob/main/examples/paul_graham_essay/InsertDemo.ipynb
    # text_splitter = TokenTextSplitter(separator=" ", chunk_size=2048, chunk_overlap=20)
    # text_chunks = text_splitter.split_text(document.text)
    # doc_chunks = [Document(t) for t in text_chunks]

    new_document_ids = []

    for document in documents:
        index.insert(document)
        new_document_ids.append(document.get_doc_id())

    # Save the updated index
    new_index_filename = get_index_timestamp_filename()
    index.save_to_disk(new_index_filename)

    # TODO: see if I can get document IDs, save them back to Directus?
    # If I return document IDs, then the Directus Flow can save them back to the document that we submitted

    return jsonify({
        'status': 'success',
        'document_id_string': ','.join(new_document_ids)
    })

@app.route('/add-url')
def add_url():
    # Example URL: http://localhost:8000/add-url?url=https%3A%2F%2Fwebaim.org%2Fintro%2F
    # Get the URL to add from the 'url' search param
    url = request.args.get('url')

    print("Adding webpage", url)

    index_filename = get_latest_index_file()

    if index_filename:
        index = GPTSimpleVectorIndex.load_from_disk(index_filename)
    else:
        index = GPTSimpleVectorIndex([])

    # Fetch the webpage URL
    document = SimpleWebPageReader(html_to_text=True).load_data([url])[0]

    # Split up the document into chunks. Followed these docs: https://github.com/jerryjliu/gpt_index/blob/main/examples/paul_graham_essay/InsertDemo.ipynb
    text_splitter = TokenTextSplitter(separator=" ", chunk_size=2048, chunk_overlap=20)
    text_chunks = text_splitter.split_text(document.text)
    doc_chunks = [Document(t) for t in text_chunks]

    for doc_chunk in doc_chunks:
        index.insert(doc_chunk)

    # Save the updated index
    new_index_filename = get_index_timestamp_filename()
    index.save_to_disk(new_index_filename)

    return redirect(url_for('home'))

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, host='0.0.0.0', port=port)
