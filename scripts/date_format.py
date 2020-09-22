from datetime import datetime
import pandas as pd

df = pd.read_csv('temp.csv', index_col=0)

l = []
l = df.index.values

for i in range(df.shape[0]):
	date = df['date'][l[i]]
	date = datetime.strptime(date, '%d-%m-%Y').strftime('%Y-%m-%d')
	df['date'][l[i]] = date
	print(f"Done with {i+1}")
	
df.to_csv('temp.csv')
