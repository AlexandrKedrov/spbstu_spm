window.addEventListener('load', init, false);

function init() {
    // Initilize buttons doing nothing but entering one number
    var numpad_buttons = document.getElementsByClassName('numpad');
    for (i = 0; i < numpad_buttons.length; i++) {
        numpad_buttons[i].onclick = function() {
            var text = text_entry.value || '';

            // Forbid straight after the right bracket
            if (text.trim().slice(-1) != ")") {
                // Remove insignificant zero
                var last_num = text.match(/[\d\.\,]+$/)
                if (last_num && last_num[0] == '0') {
                    text = text.replace(/[\d\.\,]+$/, '')
                }
                text = text + this.value;
                text_entry.value = text;
            }
        }
    }

    // Initilize buttons doing nothing but entering function
    var func_buttons = document.getElementsByClassName('func_button');
    for (i = 0; i < func_buttons.length; i++) {
        func_buttons[i].onclick = function() {
            var text = text_entry.value || '';

            // Forbid straight after the right bracket and numbers
            if (text.trim().slice(-1) != ")") {
                // Remove insignificant zero
                var last_num = text.match(/[\d\.\,]+$/);
                var should_add = false;
                if (last_num && last_num[0] == '0') {
                    text = text.replace(/[\d\.\,]+$/, '')
                    should_add = true;
                } else if (!last_num) {
                    should_add = true;
                }
                text = should_add ? text + this.value + '(' : text;
                text_entry.value = text;
            }
        }
    }

    // Initilize buttons doing nothing but entering one sign(e.g. plus, minus)
    var sign_buttons = document.getElementsByClassName('sign');
    for (i = 0; i < sign_buttons.length; i++) {
        sign_buttons[i].onclick = function() {
            var text = text_entry.value || '';

            // Allow only after digits and closing brackets
            if (text.trim().slice(-1).match(/[\d\)]/)) {
                text = text + ' ' + this.value + ' ';
                text_entry.value = text;
            }
        }
    }

    // Initilize left bracket button
    left_bracket.onclick = function() {
        var text = text_entry.value || '';
        // Forbid using after the digits and straight after the right bracket
        if (!text.trim().slice(-1).match(/[\d\.\,\)]/)) {
            text = text + this.value;
            text_entry.value = text;
        } else if (text == '0') {
            text_entry.value = this.value;
        }
    }

    // Initilize right bracket button
    right_bracket.onclick = function() {
        var text = text_entry.value || '';
        // Forbid using after the signs and straight after the left bracket
        if (!text.trim().slice(-1).match(/[\+\-\/\*\^\(]/)) {
            text = text + this.value;
            text_entry.value = text;
        }
    }

    // Initilize comma button
    comma_but.onclick = function() {
        var text = text_entry.value || '';

        // Allow only straight after the digits in the number yet without comma

        var last_num = text.trim().match(/[\d\.\,]+$/);

        if (last_num && !last_num[0].match(/[\.\,]/)) {
            text = text + this.value;
            text_entry.value = text;
        }
    }

    // Initilize delete button
    delete_button.onclick = function() {
        var text = text_entry.value || '';
        text = text.trim();
        // Detect wheather the function was the last entered
        // And if it was remove it first
        var last_func = text.match(/\w+\($/);
        if (last_func) {
            var new_length = text.length - last_func[0].length;
            text = text.substring(0, new_length);
        } else if (text.slice(-1).match(/[\+\-\/\*\^]/)) { // If the last entered is sign
            var new_length = text.length - 2; // Remove sign and 1 space
            text = text.substring(0, new_length);
        } else { // If the last entered is number or bracket
            text = text.length == 1 ? '0' : text.substring(0, text.length - 1);
        }
        text_entry.value = text;
    }

    // Initilize equals button

    equals_button.onclick = function() {
        var text = text_entry.value || '';
        var result = parseFloat(parse(text));
        if (Number.isNaN(result)) {
            text_entry.value = -1;
        } else {
            text_entry.value = Math.round(result * 10000) / 10000;
        }
    }
    // Initilize button that switces angle measurement system
    angle_measure_button.onclick = function() {
        if (this.value == 'DEG') {
            this.value = 'RAD';
        } else {
            this.value = 'DEG';
        }
    }

    // console.log(parse('5 ^ 2 * 2 * 2 / 2 + 3 -2'));

}

function exec_calc_func(func_name, value) {
    value = parseFloat(value);
    if (func_name == 'sin') {
        if (angle_measure_button.value == 'DEG') {
            value = value * Math.PI / 180;
        }
        return Math.sin(value);
    } else if (func_name == 'cos') {
        if (angle_measure_button.value == 'DEG') {
            value = value * Math.PI / 180;
        }
        return Math.cos(value);
    } else if (func_name == 'tan') {
        if (angle_measure_button.value == 'DEG') {
            value = value * Math.PI / 180;
        }
        return Math.tan(value);
    } else if (func_name == 'ln') {
        return Math.log(value);
    } else if (func_name == 'log') {
        return Math.log(value) / Math.log(10);
    } else if (func_name == 'abs') {
        return Math.abs(value);
    } else if (func_name == 'frac') {
        return value % 1;
    } else if (func_name == 'asin') {
        return angle_measure_button.value == 'DEG' ? Math.asin(value) / Math.PI * 180 : Math.asin(value);
    } else if (func_name == 'acos') {
        return angle_measure_button.value == 'DEG' ? Math.acos(value) / Math.PI * 180 : Math.acos(value);
    } else if (func_name == 'atan') {
        return angle_measure_button.value == 'DEG' ? Math.atan(value) / Math.PI * 180 : Math.atan(value);
    }
    return -1;
}

function calc_insert(callback, operand_one, operand_two, digit, op, unary) {
    // Expressions like -5 ^ 3
    if (!digit && !unary && op == '-') {
        return callback(-parseFloat(operand_one), parseFloat(operand_two)).toString();
    // Expressions like 3 * -5 ^ 3
    } else if (op && digit && unary) {
        return digit + op + callback(-parseFloat(operand_one), parseFloat(operand_two)).toString();
    // Expressions like 3 * 5 ^ 3
    } else if (op && digit && !unary) {
        return digit + op + callback(parseFloat(operand_one), parseFloat(operand_two)).toString();
    }
    // Expressions like 35 ^ 3 without preceedors
    if (!digit) {
        return callback(parseFloat(operand_one), parseFloat(operand_two));
    } else {
        return callback(parseFloat(digit+operand_one), parseFloat(operand_two));
    }
}

function parse(text) {
    var parse_text = text;
    var parse_text = parse_text.replace(/\s+/g, '');
    // Parse brackets
    var open_braces = 0;
    var close_braces = 0;
    var start = 0;
    var is_func = false;
    var func_name = '';
    var func_start = 0;
    for (var i = 0; i < parse_text.length; i++) {
        if (parse_text[i] == '(') {
            if (open_braces == 0) {
                start = i;
                if (i > 0) {
                    var text_before = parse_text.substring(0, start);
                    var func_match = text_before.match(/\w+$/);
                    if (func_match) {
                        is_func = true;
                        func_name = func_match[0];
                        func_start = start - func_name.length;
                    }
                }
            }
            open_braces++;
        }
        if (parse_text[i] == ')') {
            close_braces++;
            if (open_braces == close_braces) {
                var parsed_braces = parse(parse_text.substring(start+1, i));
                if (is_func) {
                    parse_text = parse_text.substring(0, func_start) + exec_calc_func(func_name, parsed_braces) + parse_text.substring(i+1, parse_text.length);
                } else {
                    parse_text = parse_text.substring(0, start) + parsed_braces + parse_text.substring(i+1, parse_text.length);
                }
                // Start cycle again
                open_braces = 0;
                close_braces = 0;
                is_func = false;
                func_name = '';
                func_start = 0;
                i = 0;
            }
        }
    }
    // Do power first
    while (parse_text.match(/([\d\,\.]+)\^([\d\,\.\-]+)/)) {
        parse_text = parse_text.replace(/(\d)?([\+\-\*\/])?(\-)?([\d\,\.]+)\^(\-?[\d\,\.]+)/, function(match, digit, op, unary, operand_one, operand_two) {
            return calc_insert(function(a, b) {
                return Math.pow(a, b);
            }, operand_one, operand_two, digit, op, unary);
        })
    }

    // Thence there are multiplication and division going
    var search_mul = parse_text.search(/([\d\,\.]+)\*([\d\,\.\-]+)/);
    var search_div = parse_text.search(/([\d\,\.]+)\/([\d\,\.\-]+)/);
    while (search_mul >= 0 || search_div >= 0) {
        if (search_mul >= 0 && search_div >= 0 && search_mul < search_div ||
            search_mul >= 0 && !(search_div >= 0)) {
            parse_text = parse_text.replace(/(\d)?([\+\-\*\/])?(\-)?([\d\,\.]+)\*(\-?[\d\,\.]+)/, function(match, digit, op, unary, operand_one, operand_two) {
                return calc_insert(function(a, b) {
                    return a * b;
                }, operand_one, operand_two, digit, op, unary);
            })
        } else if (search_mul >= 0 && search_div >= 0 && search_mul > search_div ||
            search_div >= 0 && !(search_mul >= 0)) {
            parse_text = parse_text.replace(/(\d)?([\+\-\*\/])?(\-)?([\d\,\.]+)\/(\-?[\d\,\.]+)/, function(match, digit, op, unary, operand_one, operand_two) {
                return calc_insert(function(a, b) {
                    return a / b;
                }, operand_one, operand_two, digit, op, unary);
            })
        }
        search_mul = parse_text.search(/([\d\,\.]+)\*([\d\,\.\-]+)/);
        search_div = parse_text.search(/([\d\,\.]+)\/([\d\,\.\-]+)/);
    }

    // Sum and substruct are the last
    var search_add = parse_text.search(/([\d\,\.]+)\+([\d\,\.\-]+)/);
    var search_sub = parse_text.search(/([\d\,\.]+)\-([\d\,\.\-]+)/);
    while (search_add >= 0 || search_sub >= 0) {
        if (search_add >= 0 && search_sub >= 0 && search_add < search_sub ||
            search_add >= 0 && !(search_sub >= 0)) {
            parse_text = parse_text.replace(/(\d)?([\+\-\*\/])?(\-)?([\d\,\.]+)\+(\-?[\d\,\.]+)/, function(match, digit, op, unary, operand_one, operand_two) {
                return calc_insert(function(a, b) {
                    return a + b;
                }, operand_one, operand_two, digit, op, unary);
            })
        } else if (search_add >= 0 && search_sub >= 0 && search_add > search_sub ||
            search_sub >= 0 && !(search_add >= 0)) {
            parse_text = parse_text.replace(/(\d)?([\+\-\*\/])?(\-)?([\d\,\.]+)\-(\-?[\d\,\.]+)/, function(match, digit, op, unary, operand_one, operand_two) {
                return calc_insert(function(a, b) {
                    return a - b;
                }, operand_one, operand_two, digit, op, unary);
            })
        }
        search_add = parse_text.search(/([\d\,\.]+)\+([\d\,\.\-]+)/);
        search_sub = parse_text.search(/([\d\,\.]+)\-([\d\,\.\-]+)/);
    }

    return parse_text;
}
