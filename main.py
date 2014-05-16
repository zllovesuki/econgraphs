from flask import Flask, render_template, redirect

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', title='EconGraphs')


@app.route('/<page_name>')
def page(page_name):
    try:
        return render_template(page_name + '.html', title=page_name)
    except:
        return redirect('/')

app.debug = True


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404
