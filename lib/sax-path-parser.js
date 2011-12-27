/*
    Copyright 2011 Emilis Dambauskas

    This file is part of CTLR-XML.

    CTLR-XML is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CTLR-XML is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with CTLR-XML.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
    
*/

/**
 *
 */
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
