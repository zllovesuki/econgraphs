## EconGraphs

The purpose of EconGraphs is to provide econ teachers with an easy-to-use set of interactive graphs for use in class. There is no login or account needed, and all graphs have a human-friendly URL so they can be bookmarked and pulled up at a moment's notice to illustrate a point.

I've tried to keep the number of technologies used here to a minimum. The front end uses [angular.js](https://angularjs.org/) for data binding, [d3.js](http://d3js.org/) for drawing the graphs, and [Twitter bootstrap](http://getbootstrap.com/) for styling. The back end was forked off the Google Cloud Platform's [Python Flask Skeleton](https://github.com/GoogleCloudPlatform/appengine-python-flask-skeleton) by Logan Henriquez and Johan Euphrosine.

## Run Locally
1. Install the [App Engine Python SDK](https://developers.google.com/appengine/downloads).
See the README file for directions. You'll need python 2.7 and [pip 1.4 or later](http://www.pip-installer.org/en/latest/installing.html) installed too.

2. Clone this repo with

   ```
   git clone https://github.com/cmakler/econgraphs.git
   ```
3. Install dependencies in the project's lib directory.
   Note: App Engine can only import libraries from inside your project directory.

   ```
   cd econgraphs
   pip install -r requirements.txt -t lib
   ```
4. Run this project locally from the command line:

   ```
   dev_appserver.py .
   ```

Visit the application [http://localhost:8080](http://localhost:8080)

See [the development server documentation](https://developers.google.com/appengine/docs/python/tools/devserver)
for options when running dev_appserver.

## Licensing
See [LICENSE](LICENSE)

## Author
Christopher Makler
