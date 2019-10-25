window.addEventListener('load', main, false);

function main()
{
    // console.log(typeof(1));
    // console.log(typeof('1'));
    // console.log(typeof(null));
    // console.log(typeof([]));
    // console.log(typeof({}));
    // console.log(typeof(undefined));
    // console.log(typeof(main));
    // console.log(typeof(true));

    // console.log(1 == '1');
    // console.log(1 === '1');
    // console.log(1 < 2);
    // console.log(true || false);
    // console.log(true && false);
    // console.log(!true);
    // console.log(1 != '1'); // !(1 == '1')
    // console.log(1 !== '1') 

    // var height = 186;
    // var min_height = 120;

    // if (height > min_height) {
    //     console.log('Dobro posjalovat\'');
    // } else {
    //     console.log('Prihodite kogda podrastete');
    // }

    // var N = 10;
    // for (var i = 0; i < N; i++)  {
    //     console.log(i*i);
    // }

    var ctx = canvas_example.getContext('2d');
    var w = canvas_example.width;
    var h = canvas_example.height;

    var dt = 0.01;
    var t_max = 2 * Math.PI;

    var N = 20;
    
    // for (var t = 0; t < t_max; t+=dt) {
    //     ctx.beginPath();
    //     ctx.arc(w * 0.5 + 100 * Math.cos(t), h * 0.5 - 100 * Math.sin(t), 5, 0, 2 * Math.PI);
    //     ctx.stroke();
    // }
    ctx.moveTo(w * 0.5 + 100, h * 0.5)
    ctx.beginPath();
    for (var t = 0; t <= t_max; t+=dt) {
        ctx.lineTo(w * 0.5 + 100 * Math.cos(t), h * 0.5 - 100 * Math.sin(t));
    }
    ctx.stroke();

    var drinks = ['water', 'milk', 'wine', 'beer'];
    console.log(drinks);
    console.log(drinks[1]);
    drinks[4] = 'coffe';
    drinks.push('tea');
    console.log(drinks);
    console.log(drinks.length);

    var a = []
    for (var i=0; i<10; i+=2) {
        a.push(i*i);
    };
    console.log(a);
    /*
        pop - delete last
        shift - delete first
        unshift - insert first
    */
   function isEven(x) {
       var result = (x % 2) == 0;
       return result;
   }

   console.log(isEven(1));
   console.log(isEven(76));
}

