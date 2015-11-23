import json
import codecs

__author__ = 'cmakler'

src_directory = 'src/js/lib/'
dest_directory = 'static/js/lib/'

with open(src_directory + 'config.json') as configfile:
    raw_file_data = configfile.read()
    bundles = json.loads(raw_file_data)
for bundle in bundles:
    result = '//Built using concatenate_dependencies.py script - do not hand edit\n\n'
    bundle_name = bundle['name']
    print 'Processing bundle ' + bundle_name + '\n'
    for file_name in bundle['order']:
        with codecs.open(src_directory + file_name, 'r', encoding='utf8') as infile:
            print '  Appending ' + file_name + '\n'
            result += "// " + file_name + "\n" + infile.read() + "\n\n"
            infile.close()
    with codecs.open(dest_directory + bundle_name + '.js', 'w', encoding='utf8') as outfile:
        outfile.write(result)
        outfile.close()