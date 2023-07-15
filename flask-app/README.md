# Flask + GPT-Index

## How to get started

- Make sure you're running at least Python 3.8
- Clone this repo
- In the repo folder, run
    - `python3 -m venv venv` to create a new Python virtual environment
    - `source venv/bin/activate` to activate the virtual environment
    - `pip install -r requirements.txt` to install the Python dependencies into the virtual environment
- To start up the server, run `gunicorn app:app`
- Load http://localhost:8000/ in your web browser
- Add a URL using the 'Add a URL' form. It will be added to the GPT index.
- Ask a question to ask GPT about the content in the index.
- Have a look at the generated `index_${timestamp}.json` files in the project folder as you add new documents.

## Docker + Docker Compose setup

This is a work in progress.