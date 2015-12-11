import json, os
from flask import Flask, render_template, redirect, url_for, request, jsonify, send_from_directory

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

@app.route('/src/ts/<path:path>')
@app.route('/static/js/kg/src/ts/<path:path>')
def ts(path):
    try:
        src = os.path.join(APP_ROOT, 'src/ts/' + path)
        return open(src).read()
    except IOError as exc:
        return str(exc)

# Re-route old URL scheme
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

# Generic addressing of graphs
@app.route('/graphs/<subject>/<topic>/<graphname>')
def graphs(graphname=None, subject=None, topic=None):
    if graphname is None or subject is None:
        return render_template('graphs/index.html')
    try:
        return render_template('graphs/' + subject + '/' + topic + '/' + graphname + '.html', title=graphname, args=request.args)
    except:
        return redirect(url_for('graphs', graphname=None, subject=None, topic=None))

# Generic routing of slides
@app.route('/slides/')
@app.route('/slides/<prof_name>/')
@app.route('/slides/<prof_name>/<course_name>/')
@app.route('/slides/<prof_name>/<course_name>/<slide_name>')
def slides(prof_name=None, course_name=None, slide_name=None):
    path = 'slides/'
    if prof_name is not None:
        path += prof_name + '/'
        if course_name is not None:
            path += course_name + '/'
            if slide_name is not None:
                path += slide_name
    try:
        return render_template(path + '.html', prof_name=prof_name, course_name = course_name, slide_name=slide_name)
    except:
        try:
            return render_template(path + 'index.html', prof_name=prof_name, course_name = course_name, slide_name=slide_name)
        except:
            return redirect(url_for('slides', slide_name=None, prof_name=None, course_name=None))

# Generic routing of course materials
@app.route('/courses')
@app.route('/courses/<path:path>')
def courses(path=None):
    if path is None:
        return render_template('courses/index.html')

    # first try to send a file
    try:

        # if the requested path includes a period, examine the extension
        if path.split('.').__len__() == 2:

            extension = path.split('.')[1]

            # if it's an HTML file, use render_template
            if extension is 'html':
                return render_template('courses/'+path)

            # otherwise just send the raw file
            else:
                directory = os.path.join(APP_ROOT, 'templates/courses/')
                return send_from_directory(directory,path)

        # if the requested path doesn't include a period, see if an HTML template by that name exists
        else:
            return render_template('courses/'+path+'.html')

    # next try to send the index file from a directory
    except:

        try:
            return render_template('courses/'+path+'/index.html')

        # and if that fails, fall back to the generic courses page
        except:
            return redirect(url_for('courses', path=None))

app.debug = True

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404
