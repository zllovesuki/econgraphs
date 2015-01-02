import json
import codecs

__author__ = 'cmakler'

with open('js/order.json') as configfile:
    raw_file_data = configfile.read()
    bundles = json.loads(raw_file_data)
for bundle in bundles:
    result = '//Built using buildjs.py script - do not hand edit\n\n'
    bundle_name = bundle['name']
    print 'Processing bundle ' + bundle_name + '\n'
    for file_name in bundle['order']:
        with codecs.open('js/' + bundle_name + '/' + file_name, 'r', encoding='utf8') as infile:
            print '  Appending ' + file_name + '\n'
            result += "// " + file_name + "\n" + infile.read() + "\n\n"
            infile.close()
    with codecs.open('static/js/' + bundle_name + '.js', 'w', encoding='utf8') as outfile:
        outfile.write(result)
        outfile.close()