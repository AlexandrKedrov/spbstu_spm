window.addEventListener('load', main, false);


function main() {
    var fps = 60;
    var dt = 1/fps;

    // var myFish = new fish(50, 30 , 5);
    // myFish.say();
    // myFish.info();
    // myFish.age++;
    // myFish.info();

    function Particle(x=0, y=0, vx=0, vy=0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        var that = this;

        this.info = function() {
            console.log('Position: (' + that.x + ', ' + that.y + ')' +
            '\nVelocity: (' + that.vx + ', ' + that.vy + ')')
        }

        this.move = function() {
            that.x += that.vx*dt;
        }

        this.draw = function() {
            ctx.beginPath();
            ctx.arc(that.x, that.y, 50, 0, 2 * Math.PI)
            ctx.stroke();
        }
    }

    var ctx = canvas_example.getContext('2d')
    var w = canvas_example.width;
    var h = canvas_example.height;

    var N = 20;
    particles = [];


    for (var i = 0; i < N; i++) {
        var phi = Math.random() * 2 * Math.PI;
        particles.push(new Particle(
            50 + Math.random() * (w - 100),
            50 + Math.random() * (h - 100),
            100 * Math.cos(phi),
            100 * Math.cos(phi)
        ));
        particles[i].info();
    }

    function phys() {
        for (var i = 0; i < N; i++) {
            particles[i].move();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < N; i++) {
            particles[i].draw();
        }
    }

    function control() {
        phys();
        draw();
    }

    setInterval(control, 1000*dt);

}
