import random
import uuid
from typing import List

from locust import HttpLocust, TaskSet, TaskSequence, seq_task, between

# replace the example urls and ports with the appropriate ones
AUTH_URL = "http://34.107.76.100:80/auth"
GAMEMASTER_URL = "http://34.107.76.100:80/gamemaster"
PLAYMASTER_URL = "http://34.107.76.100:80/socket.io"
# AUTH_URL = "http://localhost:80/auth"
# GAMEMASTER_URL = "http://localhost:80/gamemaster"
# PLAYMASTER_URL = "http://localhost:80/socket.io"


def create_user(self):
    user = {
        'username': str(uuid.uuid4()),
        'email': str(uuid.uuid4()),
        'password': 'password',
    }
    response = self.client.post(
        f"{AUTH_URL}/register", json=user, name="/auth/register/")
    # self.item_ids.append(response.json()['item_id'])
    self.usernames.append(user['username'])


def login_user(self, username_idx: int):
    user = {
        'username': self.usernames[username_idx],
        'password': 'password',
    }
    self.client.post(f"{AUTH_URL}/login", json=user,
                     name="/auth/login/")


def get_scores(self, username_idx: int):
    user = {
        'username': self.usernames[username_idx],
    }
    self.client.post(f"{GAMEMASTER_URL}/getscores", json=user,
                     name="/gamemaster/get_scores")


def start_tictactoe(self, username_idx: int):
    user = {
        'username': self.usernames[username_idx],
    }
    self.client.post(f"{GAMEMASTER_URL}/starttictactoe", json=user,
                     name="/gamemaster/starttictactoe")


def updatescoresTicTacToe(self, username_idx: int):
    user = {
        'player1': self.usernames[username_idx],
        'player2': self.usernames[username_idx],
        'winner': self.usernames[username_idx],
        'game_type': 'Tic_tac_toe',
    }
    self.client.post(f"{GAMEMASTER_URL}/updatescores", json=user,
                     name="/gamemaster/updatescores")


def start_Chess(self, username_idx: int):
    user = {
        'username': self.usernames[username_idx],
    }
    self.client.post(f"{GAMEMASTER_URL}/start_Chess", json=user,
                     name="/gamemaster/start_Chess")


def updatescoresChess(self, username_idx: int):
    user = {
        'player1': self.usernames[username_idx],
        'player2': self.usernames[username_idx],
        'winner': self.usernames[username_idx],
        'game_type': 'Chess',
    }
    self.client.post(f"{GAMEMASTER_URL}/updatescores", json=user,
                     name="/gamemaster/updatescores")


def start_Tour(self):
    Tournament = {
        'user_role': 'admin',
        'game_type': 'Chess',
    }
    response = self.client.post(
        f"{GAMEMASTER_URL}/start_Tour", json=Tournament, name="/gamemaster/start_Tour")


def Tour_list(self):
    response = self.client.get(
        f"{GAMEMASTER_URL}/Tour_list", name="/gamemaster/Tour_list")
    self.tournaments = response.json()['items']


def join_Tour(self, tournament_idx: int, username_idx: int):
    tour = self.tournaments[tournament_idx]
    user = {
        'tour_id': tour['tour_id'],
        'username': self.usernames[username_idx],
    }
    self.client.post(f"{GAMEMASTER_URL}/join_Tour", json=user,
                     name="/gamemaster/join_Tour")


class LoadTest1(TaskSequence):
    """
    Scenario where a stock admin creates an item and adds stock to it
    """
    usernames: List[int]
    tournaments: List[int]

    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.usernames = list()
        self.tournaments = list()

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        self.usernames = list()
        self.tournaments = list()

    @seq_task(1)
    def create_user(self): create_user(self)

    @seq_task(2)
    def login_user(self): login_user(self, 0)

    @seq_task(3)
    def get_scores(self): get_scores(self, 0)

    @seq_task(4)
    def start_tictactoe(self): start_tictactoe(self, 0)

    @seq_task(5)
    def start_Chess(self): start_Chess(self, 0)

    @seq_task(6)
    def start_Tour(self): start_Tour(self)

    @seq_task(7)
    def Tour_list(self): Tour_list(self)

    @seq_task(8)
    def join_Tour(self): join_Tour(self, 0, 0)

    @seq_task(9)
    def updatescoresChess(self): updatescoresChess(self, 0)

    @seq_task(10)
    def updatescoresTicTacToe(self): updatescoresTicTacToe(self, 0)


class LoadTests(TaskSet):
    # [TaskSequence]: [weight of the TaskSequence]
    tasks = {
        LoadTest1: 100,

    }


class MicroservicesUser(HttpLocust):
    task_set = LoadTests
    # how much time a user waits (seconds) to run another TaskSequence
    wait_time = between(1, 10)
