
function fish(length, width, age) {
    var that = this;
    this.length = length;
    this.width = width;
    this.age = age;

    this.say = function() {
        console.log('...');
    };

    this.info = function() {
        console.log('length: ' + that.length + '\nwidth: ' + that.length +
        '\nage: ' + that.age)
    };
}