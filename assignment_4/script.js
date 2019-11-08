window.addEventListener('load', main, false);

function Grid(x_size, y_size, x = 0, y = 0, is_solid = false) {
  this.x = x;
  this.y = y;
  this.x_size = x_size;
  this.y_size = y_size;
  this.is_solid = is_solid
  this.is_empty = !is_solid;
  this.children = [];

  var that = this;

  this.get_empty = function(radius) {
    var radius = Math.ceil(radius);

    if (radius * 2 > x_size || radius * 2 > y_size) {
      return false;
    }

    if (!that.is_solid) {
      if (that.is_empty) {
        var x_pos = that.x + Math.floor(Math.random() * (that.x_size - 2 * radius + 1));
        var y_pos = that.y + Math.floor(Math.random() * (that.y_size - 2 * radius + 1));
        this.children.push(new Grid(
          radius * 2,
          radius * 2,
          x_pos,
          y_pos,
          true
        ));
        that.is_empty = false;
        that.split();

        return [x_pos + radius, y_pos + radius];
      } else {
        for (var key in that.children) {
          var child = that.children[key];
          var ret = child.get_empty(radius);

          if (ret !== false) {
            return ret;
          }
        }
      }
    }

    return false
  }

  this.split = function() {
    if (that.children.length === 1) {
      var child = that.children[0];
      var relative_x = child.x - that.x;
      var relative_y = child.y - that.y;

      var upper_offset_y = relative_y;
      var left_offset_x = relative_x;
      var bottom_offset_y = that.y_size - relative_y - child.y_size;
      var right_offset_y = that.x_size - relative_x - child.y_size;

      if (upper_offset_y > 0) {
        that.children.push(new Grid(
          that.x_size,
          upper_offset_y,
          that.x,
          that.y
        ));
      }

      if (left_offset_x > 0) {
        that.children.push(new Grid(
          left_offset_x,
          that.y_size - upper_offset_y - bottom_offset_y,
          that.x,
          that.y + upper_offset_y
        ));
      }

      if (bottom_offset_y > 0) {
        that.children.push(new Grid(
          that.x_size,
          bottom_offset_y,
          that.x,
          that.y + upper_offset_y + child.y_size
        ));
      }

      if (right_offset_y > 0) {
        that.children.push(new Grid(
          right_offset_y,
          that.y_size - upper_offset_y - bottom_offset_y,
          that.x + left_offset_x + child.x_size,
          that.y + upper_offset_y
        ));
      }

    }
  }

  this.draw = function(ctx) {
    for (var key in that.children) {
      that.children[key].draw(ctx);
    }
    ctx.strokeRect(that.x, that.y, that.x_size, that.y_size);
  }

}


function main() {
  var fps = 60;
  var dt = 1 / fps;

  // var myFish = new fish(50, 30 , 5);
  // myFish.say();
  // myFish.info();
  // myFish.age++;
  // myFish.info();

  function Particle(x = 0, y = 0, vx = 0, vy = 0, radius = 50) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.has_interacted = {};

    var that = this;

    this.info = function() {
      console.log('Position: (' + that.x + ', ' + that.y + ')' +
        '\nVelocity: (' + that.vx + ', ' + that.vy + ')')
    }

    this.move = function() {
      that.x += that.vx * dt;
      that.y += that.vy * dt;
    }

    this.draw = function() {
      ctx.beginPath();
      ctx.arc(that.x, that.y, radius, 0, 2 * Math.PI)
      ctx.stroke();
    }
  }

  var ctx = canvas_example.getContext('2d')
  var w = canvas_example.width;
  var h = canvas_example.height;

  var N = 20;
  var particles = [];

  var grid = new Grid(w, h);

  for (var i = 0; i < N; i++) {
    var phi = Math.random() * 2 * Math.PI;
    var radius = 30 + 40 * Math.random();
    var pos = grid.get_empty(radius);
    if (pos !== false) {
      particles.push(new Particle(
        pos[0],
        pos[1],
        100 * Math.cos(phi),
        100 * Math.sin(phi),
        radius
      ));
      // grid.draw(ctx);
      // particles[particles.length - 1].draw();
    }
    // particles[i].info();
  }

  function phys() {

    for (var i = 0; i < particles.length; i++) {

      if (particles[i].x < particles[i].radius) {
        particles[i].x = particles[i].radius;
        particles[i].vx = -particles[i].vx;
      }

      if (particles[i].x > w - particles[i].radius) {
        particles[i].x = w - particles[i].radius;
        particles[i].vx = -particles[i].vx;
      }

      if (particles[i].y < particles[i].radius) {
        particles[i].y = particles[i].radius;
        particles[i].vy = -particles[i].vy;
      }

      if (particles[i].y > h - particles[i].radius) {
        particles[i].y = h - particles[i].radius;
        particles[i].vy = -particles[i].vy;
      }

      var bounce_acc_x = 0;
      var bounce_acc_y = 0;
      var bounce_count = 0;

      for (var j = 0; j < particles.length; j++) {

        if (i == j) {
          continue;
        }

        var vec = {
          x: particles[j].x - particles[i].x,
          y: particles[j].y - particles[i].y
        };

        var distance = Math.sqrt(
          Math.pow(vec.x, 2) + Math.pow(vec.y, 2)
        );

        if (distance < particles[i].radius + particles[j].radius) {
          if (particles[i].has_interacted[j] === true) {
            continue
          }
          particles[i].has_interacted[j] = true;

          var vec_n = {
            x: vec.x / distance,
            y: vec.y / distance
          };

          var vel_length = Math.sqrt(
            Math.pow(particles[i].vx, 2) + Math.pow(particles[i].vy, 2)
          );

          var vel_n = {
            x: particles[i].vx / vel_length,
            y: particles[i].vy / vel_length
          };

          var vel_proj = particles[i].vx * vec_n.x + particles[i].vy * vec_n.y;

          var alpha = Math.acos(vel_n.x * vec_n.x + vel_n.y * vec_n.y);
          var determinant = vel_n.x * vec_n.y - vel_n.y * vec_n.x;

          if (determinant == 0) {
            bounce_acc_x += -particles[i].vx;
            bounce_acc_y += -particles[i].vy;
          } else {
            bounce_acc_x += -(Math.cos(2 * alpha) * vec_n.y - vel_n.y * Math.cos(alpha)) / determinant * vel_length;
            bounce_acc_y += -(vel_n.x * Math.cos(alpha) - Math.cos(2 * alpha) * vec_n.x) / determinant * vel_length;
          }

          bounce_count++;

          //particles[i].x += vec.x * (distance - particles[i].radius - particles[j].radius);
          //particles[i].y += vec.y * (distance - particles[i].radius - particles[j].radius);
        } else {
          particles[i].has_interacted[j] = false;
        }
      }

      if (bounce_count > 0) {
        particles[i].vx = bounce_acc_x / bounce_count;
        particles[i].vy = bounce_acc_y / bounce_count;
      }

    }

    for (var i = 0; i < particles.length; i++) {
      for (var j = 0; j < particles.length; j++) {

        if (i == j) {
          continue;
        }

        var vec = {
          x: particles[j].x - particles[i].x,
          y: particles[j].y - particles[i].y
        };

        var distance = Math.sqrt(
          Math.pow(vec.x, 2) + Math.pow(vec.y, 2)
        );

        if (distance < particles[i].radius + particles[j].radius) {
        //  particles[i].x += vec.x * (distance - particles[i].radius - particles[j].radius) / distance;
        //  particles[i].y += vec.y * (distance - particles[i].radius - particles[j].radius) / distance;
        }
      }
      particles[i].move();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
  }

  function control() {
    phys();
    draw();
  }

  setInterval(control, 1000 * dt);

}
