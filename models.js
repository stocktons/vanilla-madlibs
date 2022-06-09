"use strict";

/** A Madlib created from data from the Madlibz API 
 * title: string
 * blanks: an array of parts of speech like ["noun", "verb",...]
 * storyText: an array of story snippets like ["Once there was a ", "and then ", ...]
*/
class Madlib {
    constructor ({ blanks, title, value }) {
        this.title = title;
        this.blanks = blanks;
        this.storyText = value;
    }

    static async getRandomMadlib() {
        const madlibsUrl = 'http://madlibz.herokuapp.com/api/random'
        const response = await fetch(madlibsUrl);
        const data = await response.json();
        return new Madlib(data);
    }
}



