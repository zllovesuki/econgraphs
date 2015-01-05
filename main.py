import json
from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', title='EconGraphs')


@app.route('/about')
def about():
    return render_template('about.html', title='About EconGraphs')


@app.route('/<page_name>')
def page(page_name):
    return redirect(url_for('graphs', graph_name=page_name))

@app.route('/graphs/')
@app.route('/graphs/<graph_name>')
def graphs(graph_name=None):
    if graph_name is None:
        return render_template('graphs/index.html')
    try:
        return render_template('graphs/' + graph_name + '.html', title=graph_name)
    except:
        return redirect(url_for('graphs', graph_name=None))

@app.route('/slides/')
@app.route('/slides/<prof_name>/')
@app.route('/slides/<prof_name>/<course_name>/')
@app.route('/slides/<prof_name>/<course_name>/<slide_name>')
def slides(prof_name=None, course_name=None, slide_name=None):
    if prof_name is None:
        return render_template('slides/index.html')
    if course_name is None:
        return render_template('slides/' + prof_name + '/index.html', prof_name=prof_name)
    if slide_name is None:
        return render_template('slides/' + prof_name + '/' + course_name + '/index.html', prof_name=prof_name, course_name=course_name)
    try:
        return render_template('slides/' + prof_name + '/' + course_name + '/' + slide_name + '.html', prof_name=prof_name, course_name = course_name, slide_name=slide_name)
    except:
        return redirect(url_for('slides', slide_name=None, prof_name=None, course_name=None))

app.debug = True


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404
