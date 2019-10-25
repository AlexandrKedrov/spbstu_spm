window.addEventListener('load', main, false);

function main()
{
    // your code
    console.log(1);
    var a = 21*2;
    var b = 32;
    
    console.log(b-a, b+a);
    console.log(Math.log(a));
    
    console.log(parseInt('1') + 1);
    
    some_button.onclick = function()
    {
        var number = parseFloat(some_input.value);
        some_span.innerHTML = number+5;
    };
}