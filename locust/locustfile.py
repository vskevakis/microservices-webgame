import random
import uuid
from typing import List

from locust import HttpLocust, TaskSet, TaskSequence, seq_task, between

# replace the example urls and ports with the appropriate ones
# AUTH_URL = "http://34.107.76.100:80/auth"
# GAMEMASTER_URL = "http://34.107.76.100:80/gamemaster"
# PLAYMASTER_URL = "http://34.107.76.100:80/socket.io"
AUTH_URL = "http://localhost:80/auth"
GAMEMASTER_URL = "http://localhost:80/gamemaster"
PLAYMASTER_URL = "http://localhost:80/socket.io"


def create_user(self):
    user = {
        'username': str(uuid.uuid4()),
        'email': str(uuid.uuid4()),
        'password': 'password',
    }
    response = self.client.post(
        f"{AUTH_URL}/register", json=user, name="/auth/register/][user[['username']]")
    # self.item_ids.append(response.json()['item_id'])
    self.usernames.append(user['username'])


def login_user(self, username_idx: int):
    user = {
        'username': self.usernames[username_idx],
        'password': 'password',
    }
    self.client.post(f"{AUTH_URL}/login", json=user,
                     name="/auth/login/[user['username']]")


# def create_user(self):
#     response = self.client.post(
#         f"{USER_URL}/users/create", name="/users/create/")
#     self.user_id = response.json()['user_id']


# def add_balance_to_user(self):
#     balance_to_add = random.randint(10000, 100000)
#     self.client.post(f"{USER_URL}/users/credit/add/{self.user_id}/{balance_to_add}",
#                      name="/users/credit/add/[user_id]/[amount]")


# def create_order(self):
#     response = self.client.post(
#         f"{ORDER_URL}/orders/create/{self.user_id}", name="/orders/create/[user_id]")
#     self.order_id = response.json()['order_id']


# def add_item_to_order(self, item_idx: int):
#     response = self.client.post(f"{ORDER_URL}/orders/addItem/{self.order_id}/{self.item_ids[item_idx]}",
#                                 name="/orders/addItem/[order_id]/[item_id]", catch_response=True)
#     if 400 <= response.status_code < 500:
#         response.failure(response.text)
#     else:
#         response.success()


# def remove_item_from_order(self, item_idx: int):
#     response = self.client.delete(f"{ORDER_URL}/orders/removeItem/{self.order_id}/{self.item_ids[item_idx]}",
#                                   name="/orders/removeItem/[order_id]/[item_id]", catch_response=True)
#     if 400 <= response.status_code < 500:
#         response.failure(response.text)
#     else:
#         response.success()


# def checkout_order(self):
#     response = self.client.post(f"{ORDER_URL}/orders/checkout/{self.order_id}", name="/orders/checkout/[order_id]",
#                                 catch_response=True)
#     if 400 <= response.status_code < 500:
#         response.failure(response.text)
#     else:
#         response.success()


# def checkout_order_that_is_supposed_to_fail(self, reason: int):
#     response = self.client.post(f"{ORDER_URL}/orders/checkout/{self.order_id}", name="/orders/checkout/[order_id]",
#                                 catch_response=True)
#     if 400 <= response.status_code < 500:
#         response.success()
#     else:
#         if reason == 0:
#             response.failure("This was supposed to fail: Not enough stock")
#         else:
#             response.failure("This was supposed to fail: Not enough credit")


# def make_items_stock_zero(self, item_idx: int):
#     stock_to_subtract = self.client.get(f"{STOCK_URL}/stock/find/{self.item_ids[item_idx]}",
#                                         name="/stock/find/[item_id]").json()['stock']
#     self.client.post(f"{STOCK_URL}/stock/subtract/{self.item_ids[item_idx]}/{stock_to_subtract}",
#                      name="/stock/add/[item_id]/[number]")


class LoadTest1(TaskSequence):
    """
    Scenario where a stock admin creates an item and adds stock to it
    """
    usernames: List[int]

    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.usernames = list()

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        self.usernames = list()

    @seq_task(1)
    def create_user(self): create_user(self)

    @seq_task(2)
    def login_user(self): login_user(self, 0)


# class LoadTest2(TaskSequence):
#     """
#     Scenario where a user checks out an order with one item inside that an admin has added stock to before
#     """
#     item_ids: List[int]
#     user_id: int
#     order_id: int

#     def on_start(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     def on_stop(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     @seq_task(1)
#     def admin_creates_item(self): create_item(self)

#     @seq_task(2)
#     def admin_adds_stock_to_item(self): add_stock(self, 0)

#     @seq_task(3)
#     def user_creates_account(self): create_user(self)

#     @seq_task(4)
#     def user_adds_balance(self): add_balance_to_user(self)

#     @seq_task(5)
#     def user_creates_order(self): create_order(self)

#     @seq_task(6)
#     def user_adds_item_to_order(self): add_item_to_order(self, 0)

#     @seq_task(7)
#     def user_checks_out_order(self): checkout_order(self)


# class LoadTest3(TaskSequence):
#     """
#     Scenario where a user checks out an order with two items inside that an admin has added stock to before
#     """
#     item_ids: List[int]
#     user_id: int
#     order_id: int

#     def on_start(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     def on_stop(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     @seq_task(1)
#     def admin_creates_item1(self): create_item(self)

#     @seq_task(2)
#     def admin_adds_stock_to_item1(self): add_stock(self, 0)

#     @seq_task(3)
#     def admin_creates_item2(self): create_item(self)

#     @seq_task(4)
#     def admin_adds_stock_to_item2(self): add_stock(self, 1)

#     @seq_task(5)
#     def user_creates_account(self): create_user(self)

#     @seq_task(6)
#     def user_adds_balance(self): add_balance_to_user(self)

#     @seq_task(7)
#     def user_creates_order(self): create_order(self)

#     @seq_task(8)
#     def user_adds_item1_to_order(self): add_item_to_order(self, 0)

#     @seq_task(9)
#     def user_adds_item2_to_order(self): add_item_to_order(self, 1)

#     @seq_task(10)
#     def user_checks_out_order(self): checkout_order(self)


# class LoadTest4(TaskSequence):
#     """
#     Scenario where a user adds an item to an order, regrets it and removes it and then adds it back and checks out
#     """
#     item_ids: List[int]
#     user_id: int
#     order_id: int

#     def on_start(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     def on_stop(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     @seq_task(1)
#     def admin_creates_item(self): create_item(self)

#     @seq_task(2)
#     def admin_adds_stock_to_item(self): add_stock(self, 0)

#     @seq_task(3)
#     def user_creates_account(self): create_user(self)

#     @seq_task(4)
#     def user_adds_balance(self): add_balance_to_user(self)

#     @seq_task(5)
#     def user_creates_order(self): create_order(self)

#     @seq_task(6)
#     def user_adds_item_to_order(self): add_item_to_order(self, 0)

#     @seq_task(7)
#     def user_removes_item_from_order(self): remove_item_from_order(self, 0)

#     @seq_task(8)
#     def user_adds_item_to_order_again(self): add_item_to_order(self, 0)

#     @seq_task(9)
#     def user_checks_out_order(self): checkout_order(self)


# class LoadTest5(TaskSequence):
#     """
#     Scenario that is supposed to fail because the second item does not have enough stock
#     """
#     item_ids: List[int]
#     user_id: int
#     order_id: int

#     def on_start(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     def on_stop(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     @seq_task(1)
#     def admin_creates_item1(self): create_item(self)

#     @seq_task(2)
#     def admin_adds_stock_to_item1(self): add_stock(self, 0)

#     @seq_task(3)
#     def admin_creates_item2(self): create_item(self)

#     @seq_task(4)
#     def admin_adds_stock_to_item2(self): add_stock(self, 1)

#     @seq_task(5)
#     def user_creates_account(self): create_user(self)

#     @seq_task(6)
#     def user_adds_balance(self): add_balance_to_user(self)

#     @seq_task(7)
#     def user_creates_order(self): create_order(self)

#     @seq_task(8)
#     def user_adds_item1_to_order(self): add_item_to_order(self, 0)

#     @seq_task(9)
#     def user_adds_item2_to_order(self): add_item_to_order(self, 1)

#     @seq_task(10)
#     def stock_admin_makes_item2s_stock_zero(
#         self): make_items_stock_zero(self, 1)

#     @seq_task(11)
#     def user_checks_out_order(
#         self): checkout_order_that_is_supposed_to_fail(self, 0)


# class LoadTest6(TaskSequence):
#     """
#     Scenario that is supposed to fail because the user does not have enough credit
#     """
#     item_ids: List[int]
#     user_id: int
#     order_id: int

#     def on_start(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     def on_stop(self):
#         self.item_ids = list()
#         self.user_id = -1
#         self.order_id = -1

#     @seq_task(1)
#     def admin_creates_item(self): create_item(self)

#     @seq_task(2)
#     def admin_adds_stock_to_item(self): add_stock(self, 0)

#     @seq_task(3)
#     def user_creates_account(self): create_user(self)

#     @seq_task(4)
#     def user_creates_order(self): create_order(self)

#     @seq_task(5)
#     def user_adds_item_to_order(self): add_item_to_order(self, 0)

#     @seq_task(6)
#     def user_checks_out_order(
#         self): checkout_order_that_is_supposed_to_fail(self, 1)


class LoadTests(TaskSet):
    # [TaskSequence]: [weight of the TaskSequence]
    tasks = {
        LoadTest1: 100,
        # LoadTest2: 30,
        # LoadTest3: 25,
        # LoadTest4: 20,
        # LoadTest5: 10,
        # LoadTest6: 10
    }


class MicroservicesUser(HttpLocust):
    task_set = LoadTests
    # how much time a user waits (seconds) to run another TaskSequence
    wait_time = between(1, 10)
