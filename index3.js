let operate = (a, opr, b) => {
    if (opr == '+') {
        return a + b;
    } else if (opr == '−') {
        return a - b;
    } else if (opr == '×') {
        return a * b;
    } else if (opr == '÷') {
        return a / b;
    }
}
// let copy_txt = document.getElementById('copy-txt');
let nmb1 = undefined, nmb2, opr1 = "", opr2 = "", pre_btn, to_clear1 = false, to_clear2 = false;
let output1 = document.getElementById('output-1'); output1.readOnly = true;
let output2 = document.getElementById('output-2'); output2.readOnly = true;
let calculater = document.querySelector('#calculater');
let add_to_output1 = (value) => output1.getAttribute('value') != "0" ? output1.setAttribute('value', output1.getAttribute('value') + value) : output1.setAttribute('value', value);
let change_output1_to = (value) => output1.setAttribute('value', value);
let add_to_output2 = (value) => output2.setAttribute('value', output2.getAttribute('value') + " " + value);
let change_output2_to = (value) => output2.setAttribute('value', value);
let delete_char_output2 = () => change_output2_to(output2.getAttribute('value').substring(0, output2.getAttribute('value').length - 1));
add_to_output1(0);
change_output2_to('');
let isOperation = (input) => {
    if (input == '+' || input == '−' || input == '×' || input == '÷')
        return true;
    return false;
};
calculater.addEventListener('click', (event) => {
    try {
        let value = (event.target.value);
        if (event.target.id == 'output-1') { event.target.select(); document.execCommand('copy'); return; }; // if user press on the output screen will copy the content.
        if (output1.getAttribute('value') == "0" && ((opr1 == "÷" && nmb1 != undefined) || (opr2 == "÷" && nmb2 != undefined))) { change_output1_to("ERROR"); to_clear1 = true; alert('divide on zero !!!'); return; }
        if (value == 'C') { change_output1_to('0'); change_output2_to(""); nmb1 = undefined; nmb2 = undefined; opr1 = ""; opr2 = ""; pre_btn = undefined; }//All Clear
        else if (value == 'CE') { change_output1_to('0'); if (pre_btn.value == "=") change_output2_to(""); return; }//Clear Entry (clear last entry you keyed in)
        else if (value == '±') change_output1_to(-output1.getAttribute('value'));
        else if (value == '.') { if (!output1.getAttribute('value').includes('.')) add_to_output1('.'); }
        check(value);
        trans(value);
        pre_btn = event.target;
    } catch (err) {
        change_output1_to('ERROR'); to_clear1 = true; to_clear2 = true;
    }
});

let check = (value) => {
    if (value == '=') {
        if (isOperation(pre_btn.value)) {
            delete_char_output2(); add_to_output2(value); nmb2 = undefined; opr1 = ''; opr2 = ''; to_clear1 = true; to_clear2 = true; return;
        }
        if (isNaN(output1.getAttribute('value'))) return;
        add_to_output2(output1.getAttribute('value'));
        add_to_output2(value);
        if (opr2 != "") {
            change_output1_to(operate(nmb2, opr2, parseFloat(output1.getAttribute('value'))));
            nmb1 = (operate(nmb1, opr1, parseFloat(output1.getAttribute('value')))).toFixed(3);
            change_output1_to(nmb1);
            if (nmb1 == undefined || isNaN(nmb1)) change_output1_to('ERROR');
            else if (output1.getAttribute('value').length > 16) { change_output1_to('BIG OUTPUT'); nmb1 = undefined; } // try without undefined
            nmb2 = undefined; opr1 = ''; opr2 = ''; to_clear1 = true; to_clear2 = true;
            return;
        }
        nmb1 = operate(nmb1, opr1, parseFloat(output1.getAttribute('value'))).toFixed(3);
        nmb2 = undefined; opr1 = ""; to_clear1 = true; to_clear2 = true;
        change_output1_to(nmb1);
        if (nmb1 == undefined || isNaN(nmb1)) change_output1_to('ERROR');
        else if (output1.getAttribute('value') > 9007199254740991) { change_output1_to('BIG OUTPUT'); nmb1 = undefined; }
    }
    else if (isOperation(value)) {// here when the input is operation
        if (to_clear2) { change_output2_to(""); to_clear2 = false }
        if (opr1 == "") {
            nmb1 = parseFloat(output1.getAttribute('value'));
            opr1 = value;
            to_clear1 = true;
            if (isNaN(output1.getAttribute('value'))) return;
            add_to_output2(nmb1);
            add_to_output2(opr1);
        }
        else if (opr2 == "") {
            // these two (if)s for if the user input multi opreation, then will take last one.
            if (isOperation(pre_btn.value) && opr2 == "") { opr1 = value; delete_char_output2(); add_to_output2(value); }
            else if (isOperation(pre_btn.value) && opr2 != "") { opr2 = value; delete_char_output2(); add_to_output2(value); }
            else {
                // these if for if the first opr1 wasn't '÷' OR '×' and opr2 was '÷' OR '×', then will make opr2 before opr1.
                if ((opr1 != "÷" || opr1 != "×") && (value == "÷" || value == "×")) {
                    opr2 = value;
                    nmb2 = output1.getAttribute('value'); // since opr1 != '÷' OR '×' And opr2 =='÷' OR '×' then in2 will be the output screen value.
                    to_clear1 = true;
                    if (isNaN(output1.getAttribute('value'))) return;
                    add_to_output2(nmb2);
                    add_to_output2(opr2);
                    return;
                }
                nmb1 = operate(nmb1, opr1, parseFloat(output1.getAttribute('value')));
                opr1 = value;
                if (isNaN(output1.getAttribute('value'))) return;
                add_to_output2(output1.getAttribute('value'));
                add_to_output2(opr1);
                change_output1_to(nmb1);
                if (nmb1 == undefined || isNaN(nmb1)) change_output1_to('ERROR');
                else if (output1.getAttribute('value') > 9007199254740991) { change_output1_to('BIG OUTPUT'); nmb1 = undefined; to_clear1 = true; to_clear2 = true }
                to_clear1 = true;
            }
        }
        else if (opr2 != "") {
            if (isOperation(pre_btn.value) && opr2 == "") { opr1 = value; delete_char_output2(); add_to_output2(value); return; }
            else if (isOperation(pre_btn.value) && opr2 != "") { opr2 = value; delete_char_output2(); add_to_output2(value); return; }
            if (isNaN(output1.getAttribute('value'))) return;
            add_to_output2(output1.getAttribute('value'));
            change_output1_to(operate(nmb2, opr2, parseFloat(output1.getAttribute('value'))));
            nmb1 = operate(nmb1, opr1, parseFloat(output1.getAttribute('value'))).toFixed(3);
            opr1 = value;
            change_output1_to(nmb1);
            add_to_output2(opr1);
            nmb2 = undefined; opr2 = "";
            if (nmb1 == undefined || isNaN(nmb1)) change_output1_to('ERROR');
            else if (output1.getAttribute('value') > 9007199254740991) { change_output1_to('BIG OUTPUT'); nmb1 = undefined; to_clear1 = true; to_clear2 = true }
            to_clear1 = true;
        }
    }
    else if (!(isNaN(value))) { // here when the input is number
        if (to_clear1) { change_output1_to(""); to_clear1 = false; }
        else if (to_clear2) { change_output2_to(""); to_clear2 = false }
        // else if (output1.getAttribute('value').length == 16) return;
        else if (output1.getAttribute('value') > 9007199254740991) return;
        add_to_output1(value);
    }
}

let trans = (value) => {
    if (value == '₪⇒$') change_output1_to(((output1.getAttribute('value')) * 29) / 100);
    else if (value == '$⇒₪') change_output1_to(((output1.getAttribute('value')) * 100) / 29);
    else if (value == '₪⇒€') change_output1_to(((output1.getAttribute('value')) * 25) / 100);
    else if (value == '€⇒₪') change_output1_to(((output1.getAttribute('value')) * 4));
}