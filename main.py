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

@app.route('/econ50/')
def econ50():
    return redirect(url_for('slides', slide_name=None))


@app.route('/econ50/slides/')
@app.route('/econ50/slides/<slide_name>')
def slides(slide_name=None):
    if slide_name is None:
        return render_template('slides/index.html')
    try:
        return render_template('slides/' + slide_name + '.html', title=slide_name)
    except:
        return redirect(url_for('slides', slide_name=None))

app.debug = True


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404
