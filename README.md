# Microservices Webgame

Microservices multiplayer webgame for Distributed Systems course TUC

![Register Page](https://i.imgur.com/kjuBMEw.png)
![Tournaments Page](https://i.imgur.com/6zN0gTG.png)
![Admin Panel](https://i.imgur.com/eTTzxAw.png)

## Installation

Installation via docker-compose.

```bash
docker-compose up --build
```

**_NOTE_** Administrator is admin | admin

## Nginx Front-End

http://localhost:80/

## Tasks

- [x] user register/ login/ auth (with token)
- [x] basic bootstrap ui
- [x] private routes
- [x] play tictactoe/ chess
- [x] user stats
- [x] tournaments
- [ ] implement docker swarm
- [ ] zookeeper
- [ ] deployment

## Docker cheatsheet

Remove all docker images

```bash
docker rmi $(docker images -a -q)
```

Remove all exited containers

```bash
docker rm $(docker ps -a -f status=exited -q)
```
