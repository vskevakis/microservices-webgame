# Microservices Webgame

Microservices multiplayer webgame for Distributed Systems course TUC

![Register Page](https://i.imgur.com/kjuBMEw.png)
![Tournaments Page](https://imgur.com/PvooUtO)
![Chess](https://imgur.com/TDbOQUr)

## Build and Run

Running with 3 instances of client/auth and gamemaster.
This uses load balancing and our failure handling.

```bash
docker-compose up --build --scale client=3 --scale auth=3 --scale gamemaster=3
```

Running with one instance of each container.

```bash
docker-compose up --build
```

## Remove

```bash
docker-compose down
```

**_NOTE_** Default administrator is admin | admin

## Nginx Front-End

http://localhost:80/

## Tasks

- [x] user register/ login/ auth (with token)
- [x] basic bootstrap ui
- [x] private routes
- [x] play tictactoe/ chess
- [x] user stats
- [x] tournaments
- [x] load balancing
- [x] fail handling
- [ ] zookeeper
- [ ] code optimizing
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
