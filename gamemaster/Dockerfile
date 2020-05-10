FROM python:3-slim

WORKDIR /home/gamemaster-app

COPY ./requirments.txt .

RUN pip install -r requirments.txt

COPY . .

#KOSTA THYMISOU NA TO ALLAKSOUME EDW

EXPOSE 5002

CMD gunicorn -b 0.0.0.0:5002 app:app



