import os
import pandas as pd

path = os.getcwd() + '/employee/data/'


def get_reviews():
    dataframe = pd.read_csv(path + 'final.csv', index_col=0)
    temp = dataframe.head(1000)
    dataframe = dataframe.iloc[1000:]
    temp.to_csv('temp.csv')
    dataframe.to_csv('final.csv')


def get_set():
    dataframe = pd.read_csv(path + 'temp.csv', index_col=0)
    if dataframe.shape[0] < 25:
        get_reviews()
        dataframe = pd.read_csv(path + 'temp.csv', index_col=0)
    temp = dataframe.head(10)
    dataframe = dataframe.iloc[10:]
    dataframe.to_csv(path + 'temp.csv')
    review = []
    objects = {}
    iterator = temp.index.values

    for i in range(10):
        objects['text'] = temp['text'][iterator[i]]
        objects['lang'] = temp['lang'][iterator[i]]
        objects['country_code'] = temp['country_code'][iterator[i]]
        objects['created_at'] = temp['created_at'][iterator[i]]
        objects['date'] = temp['date'][iterator[i]]
        objects['time'] = temp['time'][iterator[i]]
        objects['hashtag'] = temp['hashtag'][iterator[i]]
        objects['product'] = temp['Product'][iterator[i]]
        objects['sentiment'] = temp['Sentiment'][iterator[i]]
        objects['flag'] = temp['flag'][iterator[i]]
        review.append(objects)
        objects = {}

    return review