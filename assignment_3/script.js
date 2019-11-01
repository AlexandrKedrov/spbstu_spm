window.addEventListener('load', main, false);

var Ball = {
  color: [240, 10, 10],
  radius: 0.2,
  start_pos: [0, 0],
  current_pos: [0, 0],
  mass: 5,
  track: [],
  track_color: [10, 20, 240],
  impulse: [0, 0],
  acc_time: 0,

  init: function() {
    this.start_pos = [this.radius + 0.1, this.radius];
    this.current_pos = [this.start_pos[0], this.start_pos[1]];
  },

  apply_impulse: function(value) {
    this.impulse[0] += value[0];
    this.impulse[1] += value[1];
  },

  apply_force: function(force, dt) {
    this.apply_impulse([force[0] * dt, force[1] * dt]);
  },

  get_speed: function() {
    return [this.impulse[0] / this.mass, this.impulse[1] / this.mass];
  },

  phys: function(dt) {

    if (Math.abs(this.impulse[0]) <= dt * 0.5) {
      this.impulse[0] = 0;
    }

    if (Math.abs(this.impulse[1]) <= dt * 0.5) {
      this.impulse[1] = 0;
    }

    if (this.impulse[0] != 0 || !(this.impulse[1] <= 0 && this.current_pos[1] == this.radius)) {
      this.current_pos[0] += this.impulse[0] / this.mass * dt;
      this.current_pos[1] += this.impulse[1] / this.mass * dt;

      if (this.current_pos[1] < this.radius) {
        this.current_pos[1] = this.radius;
        this.impulse[1] = 0;
      }

      if (this.acc_time > 0) {
        this.track.push({impulse: [0, 0], dt: this.acc_time});
      }
      this.track.push({impulse: [this.impulse[0], this.impulse[1]], dt: dt});

      this.acc_time = 0;
    } else {
      this.acc_time += dt;
    }
  },

  draw: function(ctx, scale) {

    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    if ((this.current_pos[0] + this.radius + 0.1) * scale > canvas_example.width) {
      scale = canvas_example.width / (this.current_pos[0] + this.radius + 0.1);
    }

    if ((this.current_pos[1] + this.radius + 0.1) * scale > canvas_example.height) {
      scale = canvas_example.height / (this.current_pos[1] + this.radius + 0.1);
    }

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = `rgb(${this.track_color[0]}, ${this.track_color[1]}, ${this.track_color[2]})`;

    var points = [];

    ctx.beginPath();
      ctx.moveTo(this.start_pos[0] * scale, height - this.start_pos[1] * scale);
      var pos = [this.start_pos[0], this.start_pos[1]];
      for (var i = 0; i < this.track.length; i++) {

        pos[0] += this.track[i].impulse[0] / this.mass * this.track[i].dt;
        pos[1] += this.track[i].impulse[1] / this.mass * this.track[i].dt;

        ctx.lineTo(pos[0] * scale, height - pos[1] * scale);

        var b_draw_point = false;

        if (i > 1) {

          if (this.track[i].impulse[1] <= 0 && this.track[i-1].impulse[1] > 0 ||
            this.track[i].impulse[1] >= 0 && this.track[i-1].impulse[1] < 0) {
              b_draw_point = true;
          }
        }

        if (b_draw_point) {
          points.push([pos[0], pos[1]]);
        }
      }
    ctx.stroke();

    ctx.fillStyle = `rgb(${this.track_color[0]}, ${this.track_color[1]}, ${this.track_color[2]})`;

    for (var i = 0; i < points.length; i++) {
      ctx.beginPath();
        ctx.arc(points[i][0] * scale, height - points[i][1] * scale, this.radius * scale * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
    ctx.beginPath();
      ctx.arc(this.current_pos[0] * scale, height - this.current_pos[1] * scale, this.radius * scale, 0, 2 * Math.PI);
    ctx.fill();
  }

};

function plot(ctx) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;

  ctx.clearRect(0, 0, width, height);

  var t_max = 0;
  var y_max = 0;

  for (var i = 0; i < Ball.track.length; i++) {
    t_max += Ball.track[i].dt;

    var vel_x = Ball.track[i].impulse[0] / Ball.mass;
    var vel_y = Ball.track[i].impulse[1] / Ball.mass;
    var e_kin = Ball.mass * vel_x * vel_x + vel_y * vel_y * 0.5;

    if (vel_x > y_max) {
      y_max = vel_x;
    }

    if (vel_y > y_max) {
      y_max = vel_y;
    }

    if (e_kin > y_max) {
      y_max = e_kin;
    }
  }

  // T Axe
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = 'black';

  ctx.beginPath()
    ctx.moveTo(0, height * 0.5)
    ctx.lineTo(width, height * 0.5)
  ctx.stroke()

  var w_scale = width / t_max;
  var h_scale = height / y_max * 0.5;

  ctx.lineWidth = 1.5;

  // X Velocity
  ctx.strokeStyle = 'blue';
  var t = 0;

  ctx.beginPath();
    ctx.moveTo(0, height * 0.5 - Ball.track[0].impulse[0] / Ball.mass * h_scale);
    for (var i = 0; i < Ball.track.length; i++) {
      t += Ball.track[i].dt;
      ctx.lineTo(t * w_scale, height * 0.5 - Ball.track[i].impulse[0] / Ball.mass * h_scale);
    }
  ctx.stroke()

  // Y Velocity
  ctx.strokeStyle = 'green';
  t = 0;
  ctx.beginPath();
    ctx.moveTo(0, height * 0.5 - Ball.track[0].impulse[1] / Ball.mass * h_scale);
    for (var i = 0; i < Ball.track.length; i++) {
      t += Ball.track[i].dt;
      ctx.lineTo(t * w_scale, height * 0.5 - Ball.track[i].impulse[1] / Ball.mass * h_scale);
    }
  ctx.stroke()

  ctx.strokeStyle = 'red';
  t = 0;
  ctx.beginPath();
    var vel_x0 = Ball.track[0].impulse[0] / Ball.mass;
    var vel_y0 = Ball.track[0].impulse[1] / Ball.mass;
    var e_kin0 = Ball.mass * vel_x0 * vel_x0 + vel_y0 * vel_y0 * 0.5;
    ctx.moveTo(0, height * 0.5 - e_kin0 * h_scale);
    for (var i = 0; i < Ball.track.length; i++) {
      t += Ball.track[i].dt;
      var vel_x = Ball.track[i].impulse[0] / Ball.mass;
      var vel_y = Ball.track[i].impulse[1] / Ball.mass;
      var e_kin = Ball.mass * vel_x * vel_x + vel_y * vel_y * 0.5;
      ctx.lineTo(t * w_scale, height * 0.5 - e_kin * h_scale);
    }
  ctx.stroke()
}

// Restricts input for the given textbox to the given inputFilter.
function set_input_filter(textbox, input_filter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (input_filter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
      });
  });
};

function set_input_filter_all(elements, input_filter) {
  Array.prototype.forEach.call(elements, function(element) {
    // Restrict input to digits and '.' by using a regular expression filter.
    set_input_filter(element, input_filter);
  })
}

function main() {

  var decimal_inputs = document.getElementsByClassName('input_box_decimal');

  set_input_filter_all(decimal_inputs, function(value) {
    return /^\d*\.?\d*$/.test(value);
  });

  var fps = 60;
  var dt = 1 / fps;
  var ctx = canvas_example.getContext('2d');
  var ctx_plot = canvas_plot.getContext('2d');
  var opposite_force = 5;
  var scale = 100;

  Ball.init();

  var fired = false;

  fire.onclick = function() {
    var velocity = parseFloat(velocity_input.value) || 0;
    var angle = parseFloat(angle_input.value) || 0;
  
    angle = angle > 90 ? 90:angle;
    angle = angle / 180 * Math.PI;

    Ball.apply_impulse([velocity * Math.cos(angle) * Ball.mass, velocity * Math.sin(angle) * Ball.mass])

    fired = true;
  }
  setInterval(function() {
    if (fired) {
      Ball.apply_force([0, -9.82], dt);

      if (Ball.current_pos[1] == Ball.radius && Ball.get_speed()[0] > 0) {
        Ball.apply_force([-opposite_force, 0], dt);
      }

      Ball.phys(dt);
      plot(ctx_plot);
    }
    Ball.draw(ctx, scale);
  }, 1000 / fps);
}
