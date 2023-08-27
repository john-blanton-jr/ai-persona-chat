FROM python:3.10-bullseye
RUN python -m pip install --upgrade pip
ENV PYTHONPATH=/code/app
WORKDIR /code
COPY requirements.txt /code/
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./app /code/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]

# docker build -t app .
# docker run --name app -d -p 80:80 app