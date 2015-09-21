import json, os
from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
graph_list_file = os.path.join(APP_ROOT, 'graph_list.json')


def open_json_file(open_file=graph_list_file):
    with open(os.path.join(open_file), 'r') as datafile:
        return json.load(datafile)

@app.route('/')
def index():
    return render_template('index.html', title='EconGraphs')


@app.route('/about')
def about():
    return render_template('about.html', title='About EconGraphs')


@app.route('/graphs/<graphname>')
def old_graphs(graphname=None):
    old_graph_list = open_json_file('graph_redirects_list.json')
    if graphname in old_graph_list:
        name_data = old_graph_list[graphname]
        if 'new_name' in name_data:
            current_name = name_data['new_name']
        else:
            current_name = graphname
        return redirect(url_for('graphs',
                                graphname=current_name,
                                subject=name_data['subject'],
                                topic=name_data['topic']))
    else:
        try:
            return render_template('graphs/' + graphname + '/' + 'index.html')
        except:
            return redirect(url_for('index'))


@app.route('/graphs/<subject>/<topic>/<graphname>')
def graphs(graphname=None, subject=None, topic=None):
    graphlist = open_json_file()
    if graphname is None or subject is None:
        return render_template('graphs/index.html', graphlist=graphlist)

    try:
        return render_template('graphs/' + subject + '/' + topic + '/' + graphname + '.html', title=graphname)
    except:
        return redirect(url_for('graphs', graphname=None, subject=None, topic=None, graphlist=graphlist))


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
