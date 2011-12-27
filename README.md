# CTLR-XML

XML handling utilities for RingoJS.

## Usage

### Example

```javascript
// A SAX parser that triggers events for elements on matching branches in the element tree.
var parser = require("ctlr-xml/sax-path-parser");

// A very simple RSS handler:
var rss_handlers = {
    startDocument: function() {
        print("Started parsing RSS file.");
    },
    "/rss/channel/item": {
        startElement: function() {
            print("New <item> tag.");
        }
    },
    "/rss/channel/item/link": {
        endContent: function(str) {
            print("item url:", str);
        }
    },
    // shorthand for above:
    "/rss/channel/item/title": function(str) {
        print("item title:", str);
    }
};

// This will execute the handlers defined above:
parser.parseFile("/path/to/local/file.rss", rss_handlers);
```

### API summary

#### ctlr-xml/sax-parser

<table><tbody>
<tr><td align="right">void</td>
    <td><b>setFileName</b> (file_name)</td>
    <td>Specifies which file to parse.</td></tr>
<tr><td align="right">void</td>
    <td><b>setContentHandler</b> (content_handler)</td>
    <td>Specifies which content handler to use.</td></tr>
<tr><td align="right">void</td>
    <td><b>parse</b> ()</td>
    <td>Parses the specified file with a given content handler.<br>Uses org.xml.sax.helpers.XMLReaderAdapter to do the job.</td></tr>
</tbody></table>

#### ctlr-xml/sax-path-parser

<table><tbody>
<tr><td align="right">void</td>
    <td><b>parseFile</b> (file_name, content_handlers)</td>
    <td>Parses an XML file using handlers defined in a given dictionary.</td></tr>
<tr><td align="right">PathHandler</td>
    <td><b>createContentHandler</b> (content_handlers)</td>
    <td>Creates an object for use with sax-parser.parse() from a dictionary matching element paths.</td></tr>
</tbody></table>

### Requirements

- [RingoJS](http://ringojs.org/) v0.8

## About

### License

This is free software, and you are welcome to redistribute it under certain conditions; see LICENSE.txt for details.

### Author contact

Emilis Dambauskas <emilis.d@gmail.com>, <http://emilis.github.com/>
