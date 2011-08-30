

exports.parseFile = function(file_name, pathHandler) {

    var parser = require("ctlr-xml/sax-parser");

    if (pathHandler instanceof PathHandler) {
        parser.setContentHandler(pathHandler);
    } else {
        parser.setContentHandler(
            this.createContentHandler(pathHandler));
    }

    parser.setFileName(file_name);
    return parser.parse();
};


/**
 *
 */
exports.createContentHandler = function(pathHandler) {

    return new PathHandler(pathHandler);
};


/**
 *
 */
function PathHandler(pathHandlers) {

    this.pathHandlers = pathHandlers;

    this.path = [];
    this.pathStr = "";
    this.str = "";

    /**
     *
     */
    this.startDocument = function() {

        this.path = [];
        this.pathStr = "";
        this.str = false;

        if (this.pathHandlers.startDocument) {
            this.pathHandlers.startDocument();
        }
    };


    /**
     *
     */
    this.endDocument = function() {
        
        if (this.pathHandlers.endDocument) {
            this.pathHandlers.endDocument();
        }
    }


    /**
     *
     */
    this.startElement = function(namespaceURI, localName, qName, atts) {

        this.path.push(qName);
        this.pathStr = "/" + this.path.join("/");

        var handler = this.pathHandlers[this.pathStr];
        if (handler && handler.startElement) {
            handler.startElement(namespaceURI, localName, qName, atts);
        }
    };


    /**
     *
     */
    this.endElement = function(namespaceURI, localName, qName) {
        
        if (qName != this.path.pop()) {
            throw Error("Last closed element does not match last opened element.");
        }

        var handler = this.pathHandlers[this.pathStr];
        if (handler && handler.endElement) {
            handler.endElement(namespaceURI, localName, qName);
        }

        this.str = this.str.trim();
        if (this.str) {
            this.endContent(this.str);
        }
        // Clear character data:
        this.str = "";

        // Important: update pathStr
        this.pathStr = "/" + this.path.join("/");
    };


    /**
     *
     */
    this.characters = function(ch, start, length) {

        this.str += new java.lang.String(ch, start, length);
    };



    /**
     *
     */
    this.endContent = function(str) {

        var handler = this.pathHandlers[this.pathStr];
        if (handler) {
            if (handler instanceof Function) {
                handler(str);
            } else if (handler.endContent) {
                handler.endContent(str);
            }
        }
    };
}
