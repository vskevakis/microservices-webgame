# Microservices Webgame

Microservices multiplayer webgame for Distributed Systems course TUC

![Login Page](https://i.imgur.com/39cK5wt.png)
![Tic Tac Toe Game](https://i.imgur.com/pCzML4B.png)

## Installation

Installation via docker-compose.

```bash
sudo docker-compose up --build
```

## Nginx Front-End

http://localhost:80/

## Tasks

- [x] user register/ login
- [x] basic- ui and home
- [x] token generation
- [x] private routes
- [x] gameserver
- [x] play tictactoe
- [ ] play chess
- [ ] user stats
- [ ] tournaments

## Docker cheatsheet

Remove all docker images

```bash
docker rmi $(docker images -a -q)
```

Remove all exited containers

```bash
docker rm $(docker ps -a -f status=exited -q)
```
