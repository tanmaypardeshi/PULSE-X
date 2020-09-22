import os
import pandas as pd

path = os.getcwd() + '/employee/data/'


def get_reviews():
    dataframe = pd.read_csv(path + 'final.csv', index_col=0)
    temp = dataframe.head(1000)
    dataframe = dataframe.iloc[1000:]
    temp.to_csv(path + 'temp.csv')
    dataframe.to_csv(path + 'final.csv')


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
        objects['productid'] = temp['ProductId'][iterator[i]]
        objects['userid'] = temp['UserId'][iterator[i]]
        objects['profile_name'] = temp['ProfileName']
        objects['time'] = temp['Time']
        objects['text'] = temp['Text'][iterator[i]]
        objects['sentiment'] = temp['Sentiment'][iterator[i]]
        objects['helpfulness'] = temp['Helpfulness'][iterator[i]]
        objects['date'] = temp['date'][iterator[i]]
        objects['flag'] = temp['flag'][iterator[i]]
        objects['sarcasm'] = temp['sarcasm'][iterator[i]]
        objects['product'] = temp['Product'][iterator[i]]
        objects['country'] = temp['country'][iterator[i]]
        objects['lang'] = temp['lang'][iterator[i]]
        objects['url'] = temp['url'][iterator[i]]
        review.append(objects)
        objects = {}
    return review
