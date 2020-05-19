# Microservices Webgame

Microservices multiplayer webgame for Distributed Systems course TUC

## Installation

Installation via docker-compose.

```bash
sudo docker-compose up --build
```

## Nginx Frond-End

http://localhost:80/

## Tasks

- [x] user register
- [x] user login
- [x] basic- ui and home
- [x] token generation
- [x] private routes
- [ ] gameserver
- [ ] play games

## Docker cheatsheet

Remove all docker images

```bash
sudo docker rmi $(docker images -a -q)
```

Remove all exited containers

```bash
sudo docker rm $(docker ps -a -f status=exited -q)
```
