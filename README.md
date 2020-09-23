# Pasckathon_git_commit

## PULSE - X : The complete social media intelligence platform with dynamic sentiment analysis​


#### [Click here for the Drive link to find the csv files and PPT for both rounds](https://drive.google.com/drive/folders/1CWYgf5lB49S3RUyVeBO8lw8L6m6Eba2b?usp=sharing)

#### [Click here for the PPT for judging round]()

## Prequisites on the local machine to project to be run:

1. Python 3.6 or above 
2. Node JS v12.0.0 or above 
3. Yarn 1.22.4
4. Expo SDK 38
5. pip 3 v20.0.x or above
 

## Steps to run the project on the local machine

1. Clone this repository into your local machine by using<br> 
    `git clone https://github.com/tanmaypardeshi/Pasckathon_git_commit.git`

* ### Setting up the django development server:

1. Install virtualenv using **pip3 install virtualenv**
2. Create a new virtualenv using **virtualenv venv**
3. Activate virtualenv using **source venv/bin/activate**
4. Install all required dependencies using **pip install -r requirements.txt**
5. cd into the <i>backend</i> directory and run the following commands to set up database and populate data into it
    1. python manage.py makemigrations user
    2. python manage.py makemigrations employee
    3. python manage.py migrate
    4. python manage.py loaddata user.json
    5. python manage.py loaddata review.json
6. To run the development server **python manage.py runserver**.
7. Deactivate the virtualenv using **deactivate**.

**Note: Step 1,2,4 and 5 are one time process to set up data and dependencies**.

* ### Setting up the react local server:

1. cd into the <i>frontend</i> directory.
2. Use command **yarn** to install node modules for the front end.
3. Keep the django server up and running to make the website functional.
4. Once the node modules have been installed, run **yarn start** to start the development server.

* ### Setting up expo SDK for the mobile app:

1. cd into the <i>mobile</i> directory.
2. Use command **yarn** to install node modules for the mobile app.
3. Keep the django server up and running on your local network to make the app functional.
    **Note that the command for the django server in this case will be python manage.py runserver <ip-address>:8000**
4. Once the node modules have been installed, run **yarn start** to start the expo server.
5. Scan the QR code on your mobile device using the expo app available on play store.


### Information about the directories in the repository
#### (Click on the file name to open the folder)

| Directory Name                     | Description                          |
| :-----------------------------:  | :--------------------------------    |
|[backend](backend/))  |Django REST framework app with the APIs|
|[frontend](frontend/))  |Front end for the web app made in React|
|[mobile](mobile/))  |Mobile app using React Native and Expo SDK|
|[Machine_Learning](Machine_Learning/))  |Notebooks used for the multilayered filtering approach|
|[scripts](scripts))  |Python scripts to extract data from csv|


### Information about the notebooks in the Machine_Learning directory
#### ( Click on the notebook to access )

| Notebook Name                     | Description                          |
| :-----------------------------:  | :--------------------------------    |
|[Json_Processing.ipynb](Machine_Learning/Json_Processing.ipynb)|Extracts the data from json format and converts it to a csv|
|[Text_Preprocessing.ipynb](Machine_Learning/Text_Preprocessing.ipynb)|Preprocesses the data by performing lemmatisation, tokenisation and removes stop words to bring the data in the required format by the models|
|[SentimentAnalysis.ipynb](Machine_Learning/SentimentAnalysis.ipynb)|The polarity of a tweet is analysed by using a pretrained model from TextBlob|
|[KeywordsExtraction.ipynb](Machine_Learning/KeywordsExtraction.ipynb)|Extraction of aspects and keywords essential to the product|
|[SarcasmDetection.ipynb](Machine_Learning/SarcasmDetection.ipynb)|To detect the true intent behind the review|
