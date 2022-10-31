const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

    translate(text, locale) {
        let translated = false;
        let lastChar = '';
        
        // If last char is '.' or '?' or '!'
        if (/[.?!]/.test(text[text.length - 1])) {
            // Save last char
            lastChar = text[text.length - 1];
            // Remove last char and add extra space
            text = text.slice(0, -1) + ' ';
        } else {
            // Just add extra space
            text = text + ' ';
        }
        
        // Time
        function changeTime(each, eachReplaced) {
            text = text.replace(each, '<span class="highlight">' + eachReplaced + '</span>');
            translated = true;
        }

        // Create an empty array to store all times
        let timeStr = [];
        timeStr.push(text.match(/[0-9]{1,2}[:|.][0-9]{1,2}/g));
        
        for (const each of timeStr.flatMap(each => each)) {
            let eachReplaced;

            // If locale is 'american-to-british', change ':' to '.'
            if (locale == 'american-to-british' && /[0-9]{1,2}[:][0-9]{1,2}/.test(each)) {
                eachReplaced = each.replace(/[:]/g, '.');
                changeTime(each, eachReplaced);
            } else if (locale == 'british-to-american' && /[0-9]{1,2}[.][0-9]{1,2}/.test(each)) {
                // If locale is 'british-to-american', change '.' to ':'
                eachReplaced = each.replace(/[.]/g, ':');
                changeTime(each, eachReplaced);
            }
        }
        
        // Titles
        // Reverse 'americanToBritishTitles' for locale == 'british-to-american'
        const reversedAmericanToBritishTitles = Object.fromEntries(Object.entries(americanToBritishTitles).map(each => each.reverse()));

        function changeTitles(localeChoice) {
            for (const each of text.split(' ')) {
                if (localeChoice[each.toLowerCase()] != undefined) {
                    text = text.replace(each, '<span class="highlight">' 
                        + localeChoice[each.toLowerCase()][0].toUpperCase() 
                        + localeChoice[each.toLowerCase()].substring(1)
                        + '</span>');
                    translated = true;
                }
            }
        }

        if (locale == 'american-to-british') {
            changeTitles(americanToBritishTitles);
        } else if (locale == 'british-to-american') {
            changeTitles(reversedAmericanToBritishTitles);
        }

        // Spellings and words
        // Array of American spelling JSONs
        const spellingsAmerican = [
            americanToBritishSpelling, 
            americanOnly
        ];

        // Array of British spelling JSONs
        const spellingsBritish = [
            Object.fromEntries(Object.entries(americanToBritishSpelling).map(each => each.reverse())), 
            britishOnly
        ];

        function changeSpellings(localeChoice) {
            for (const element in localeChoice) {
                Object.keys(localeChoice[element]).some(word => {
                    // If text includes any word as key in 'localeChoice', replace it with corresponding value (lowercased)
                    if (text.toLowerCase().includes(word)) {
                        // Create regex to find 'word' + blank space in text (case insensitive)
                        let wordRegEx = new RegExp(word + ' ', 'i');
                        
                        // For elements 0 and 1
                        text = text.replace(wordRegEx, '<span class="highlight">' 
                            + localeChoice[element][word] 
                            + '</span> ');
                        translated = true;
                    }
                });
            }
        }

        if (locale == 'american-to-british') {
            changeSpellings(spellingsAmerican);
        } else if (locale == 'british-to-american') {
            changeSpellings(spellingsBritish);
        }

        // Remove ending space that was added at the beginning
        text = text.slice(0, -1);

        // Add last char that was removed at the beginning (empty string if nothing has been removed)
        text += lastChar;

        if (translated == true) {
            return text;
        } else {
            return "Everything looks good to me!";
        }
    }
}

module.exports = Translator;