# start by pulling the python image
FROM --platform=linux/x86_64 python:3.11-slim-buster

# # copy the requirements file into the image
# COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# # Add .cargo/bin to PATH
# ENV PATH="/root/.cargo/bin:${PATH}"


RUN apt-get update
RUN apt-get -y install libmagic1
# RUN pip install --upgrade pip

# install the dependencies and packages in the requirements file
# RUN pip install -r requirements.txt
RUN pip install flask unstructured gpt-index requests gunicorn unstructured[local-inference]

# copy every content from the local file to the image
COPY . /app

# # configure the container to run in an executed manner
# ENTRYPOINT [ "python" ]

# CMD ["view.py" ]