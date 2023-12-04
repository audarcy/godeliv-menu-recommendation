# Use the official Python image from the Docker Hub
FROM python:3

# Set the working directory inside the container
ADD main.py .

# Copy the current directory contents into the container at /app
COPY . /godeliv_TST
WORKDIR /godeliv_TST
COPY ./requirements.txt /godeliv_TST/requirements.txt
# Install any necessary dependencies
RUN pip install --no-cache-dir --upgrade -r /godeliv_TST/requirements.txt  

# Command to run the FastAPI server when the container starts
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# FROM python:3.8-alpine

# WORKDIR /

# COPY . .

# RUN python -m pip install --upgrade pip

# RUN apk update && apk add python3-dev \
#                         gcc \
#                         libc-dev \
#                         libffi-dev 

# RUN pip install --no-cache-dir --upgrade -r requirements.txt

# EXPOSE 8000

# CMD [ "python", "main.py" ]