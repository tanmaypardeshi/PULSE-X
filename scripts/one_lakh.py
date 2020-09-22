import pandas as pd

df = pd.read_csv('finale.csv', index_col=0)

df = df.head(10000)

df.to_csv('final.csv')
