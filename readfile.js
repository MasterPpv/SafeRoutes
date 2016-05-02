function read_file(url) {
    var file = new XMLHttpRequest();
    file.overrideMimeType('text/plain');
    file.open('GET', url, false);
    var text;
    file.onreadystatechange = function() {
        if (file.readyState === 4) {
            if (file.status === 200 || file.status == 0) {
                text = file.responseText;
            }
        }
    }
    file.send(null);
    return text;
}

function read_csv(url) {
    var file = new XMLHttpRequest();
    file.overrideMimeType('text/plain');
    file.open('GET', url, false);
    var rows = [];
    file.onreadystatechange = function() {
        if (file.readyState === 4) {
            if (file.status === 200 || file.status == 0) {
                text = file.responseText;
                var lines = text.split('\n');
                var header = lines[0].split(', ');
                for (var i = 1; i < lines.length; i++) {
                    var row_dict = {};
                    for (var j = 0; j < header.length; j++) {
                        row_dict[header[j]] = lines[i].split(', ')[j];
                    }
                    rows.push(row_dict);
                }
            }
        }
    }
    file.send(null);
    return rows;
}

function parse_crimes(url) {
    var file = new XMLHttpRequest();
    file.overrideMimeType('text/plain');
    file.open('GET', url, false);
    var crimes = [];
    file.onreadystatechange = function() {
        if (file.readyState === 4) {
            if (file.status === 200 || file.status == 0) {
                var text = file.responseText;
                var lines = text.split('\n');
                var start_flag = false;
                var crime = {};
                for (var i = 0; i < lines.length; i++) {
                    var m1 = /^0 -12 Td \((.+)\) Tj/.exec(lines[i]);
                    if (m1 == null) {
                        continue;
                    }
                    line = m1[1].trim();
                    var m2 = /^(C16\-\d\d\d\d\d)\s+(.+)\s\s+/.exec(line);
                    if (m2 != null & start_flag) {
                        crimes.push(crime);
                        crime = {};
                        crime.id = m2[1];
                        crime.type = m2[2].trim();

                    }
                    if (m2 != null & !start_flag) {
                        crime.id = m2[1];
                        crime.type = m2[2].trim();
                        start_flag = true;
                    }
                    var m3 = /LOCATION: (.+)/.exec(line);
                    if (m3 != null) {
                        crime.location = m3[1].trim().replace('/', '&') + ' Champaign, Il';
                    }
                    var m4 = /OCCURRED: (.+) REPORTED: (.+)/.exec(line);
                    if (m4 != null) {
                        crime.date_occurred = m4[1].trim().split(/\s+/)[0];
                        crime.time_occurred = m4[1].trim().split(/\s+/)[1];
                        crime.date_reported = m4[2].trim().split(/\s+/)[0];
                        crime.time_reported = m4[2].trim().split(/\s+/)[1];
                    }
                    var m5 = /OFFICER: (.+)/.exec(line);
                    if (m5 != null) {
                        crime.officer = m5[1].trim();
                    }
                    var m6 = /SUMMARY: (.+)/.exec(line);
                    if (m6 != null) {
                        crime.summary = m6[1].trim();
                    }
                    var m7 = /ARRESTS: (.+) AGE: (.+) SEX: (M|F)/.exec(line);
                    if (m7 != null) {
                        crime.arrests = m7[1].trim();
                        crime.age = m7[2].trim();
                        crime.sex = m7[3].trim();
                    }
                }
            }
        }
    }
    file.send(null);
    return crimes;
}

// var CSV = {
//     parse: function(csv, reviver) {
//         reviver = reviver || function(r, c, v) { return v; };
//         var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row;
//         while (c < cc) {
//             table.push(row = []);
//             while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
//                 start = end = c;
//                 if ('"' === chars[c]){
//                     start = end = ++c;
//                     while (c < cc) {
//                         if ('"' === chars[c]) {
//                             if ('"' !== chars[c+1]) { break; }
//                             else { chars[++c] = ''; } // unescape ""
//                         }
//                         end = ++c;
//                     }
//                     if ('"' === chars[c]) { ++c; }
//                     while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { ++c; }
//                 } else {
//                     while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { end = ++c; }
//                 }
//                 row.push(reviver(table.length-1, row.length, chars.slice(start, end).join('')));
//                 if (',' === chars[c]) { ++c; }
//             }
//             if ('\r' === chars[c]) { ++c; }
//             if ('\n' === chars[c]) { ++c; }
//         }
//         return table;
//     },

//     stringify: function(table, replacer) {
//         replacer = replacer || function(r, c, v) { return v; };
//         var csv = '', c, cc, r, rr = table.length, cell;
//         for (r = 0; r < rr; ++r) {
//             if (r) { csv += '\r\n'; }
//             for (c = 0, cc = table[r].length; c < cc; ++c) {
//                 if (c) { csv += ','; }
//                 cell = replacer(r, c, table[r][c]);
//                 if (/[,\r\n"]/.test(cell)) { cell = '"' + cell.replace(/"/g, '""') + '"'; }
//                 csv += (cell || 0 === cell) ? cell : '';
//             }
//         }
//         return csv;
//     }
// };
