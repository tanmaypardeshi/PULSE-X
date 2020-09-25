import os
from random import randint
import pandas as pd

path = os.getcwd() + '/employee/data/'


def get_twitter():
    df = pd.read_csv(path + 'twitter.csv', index_col=0)
    twitter_list = []
    objects = {}
    for i in range(10):
        id = randint(0, 38)
        d = df.iloc[id]
        objects['text'] = d['text']
        objects['helpfulness'] = d['helpfulness']
        objects['sarcasm'] = d['sarcasm']
        objects['product'] = d['product']
        objects['sentiment'] = d['sentiment']
        objects['flag'] = d['flag']
        twitter_list.append(objects)
        objects = {}
    return twitter_list


def get_amazon():
    df = pd.read_csv(path + 'amazon.csv', index_col=0)
    amazon_list = []
    objects = {}
    for i in range(10):
        id = randint(0, 222)
        d = df.iloc[id]
        objects['text'] = d['text']
        objects['helpfulness'] = d['helpfulness']
        objects['sarcasm'] = d['sarcasm']
        objects['product'] = d['product']
        objects['sentiment'] = d['sentiment']
        objects['flag'] = d['flag']
        amazon_list.append(objects)
        objects = {}

    return amazon_list