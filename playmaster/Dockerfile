FROM python:3-slim

WORKDIR /home/playmaster-app

COPY ./requirments.txt .

RUN pip install -r requirments.txt

COPY . .

#KOSTA THYMISOU NA TO ALLAKSOUME EDW

EXPOSE 5001

CMD gunicorn -b 0.0.0.0:5001 app:app