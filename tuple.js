///////////////////////////////////////////////////
// tuple library v0.1 /////////////////////////////
// Copyright (c) 2011, Alvaro J. Genial ///////////
// Released under the MIT, BSD, and GPL licenses //

function Tuple(/*elements...*/) {
    if (this instanceof Tuple) {
        var length = this.length = arguments.length;
        for (var a = 0; a < length; ++a) this[a] = arguments[a];/*
        if (length > 0) (this.first  = this[0], this.last = this[length - 1]);
        if (length > 1) (this.second = this[1], this.penult = this[length - 2]);
        if (length > 2) (this.third  = this[2], this.antepenult = this[length - 3]);*/
        if (Object.freeze) Object.freeze(this);
    }
    else {
        return Tuple.construct.apply(null, arguments);
    }
}

(function() {

var global = this;
var facade = function () {};
facade.prototype = Tuple.prototype;

Tuple.construct = function(/*elements...*/) { var elements = arguments;
    var tuple = function() { return Tuple.apply(this, elements); };
    tuple.prototype = new facade();
    return new tuple;
};

// Tuple.fromObject = function fromObject(object) {};
// Tuple.prototype.toObject = function toObject() {};

Tuple.fromArray = function(array) {
    return Tuple.apply(null, array);
};

Tuple.prototype.toString = function() {
    return '(' + this.join(',') + ')';
};

Tuple.prototype.toArray = function() {
    return Array.prototype.slice.call(this);
};

Tuple.prototype.slice = function(i, j) {
    return Tuple.fromArray(Array.prototype.slice.apply(this, arguments));
};

Tuple.prototype.drop = function(n) { return this.slice(n); };
Tuple.prototype.take = function(n) { return this.slice(0, n); };

Tuple.prototype.lead = function() { return this.take(-1); };
Tuple.prototype.tail = function() { return this.drop(1); };
    
Tuple.prototype.at = function(index) {
    return this[index + (index < 0 ? this.length : 0)];
};

Tuple.prototype.cons = function(element) {
    return this.prepend(element);
};

Tuple.prototype.intern = function() {
    throw Error("not implemented");
};

Tuple.prototype.prepend = function(/*elements...*/) {
    return Tuple.fromArray(arguments).concat(this);
};

Tuple.prototype.append = function(/*elements...*/) {
    return this.concat(arguments);
};

Tuple.prototype.concat = function(/*sequences...*/) {
    for (var array = this.toArray(), i = 0; i < arguments.length; ++i)
        Array.prototype.push.apply(array, arguments[i]);
    return Tuple.fromArray(array);
};

Tuple.prototype.join = function(separator) {
    return Array.prototype.join.call(this, separator);
};

Tuple.prototype.each = function(fn) {
    for (var result, i = 0; i < this.length; ++i)
        if ((result = fn.call(this, this[i], i)) !== undefined)
            return result;
};

Tuple.prototype.hasAny  = function(p) { return this.count(p) !== 0; };
Tuple.prototype.hasAll  = function(p) { return this.count(p) === this.length; };
Tuple.prototype.hasOne  = function(p) { return this.count(p) === 1; };
Tuple.prototype.hasNone = function(p) { return this.count(p) === 0; };

function isMatch(context, predicate, value, index) {
    return is(predicate, value) ||
        (typeof predicate === 'function' && 
            predicate.call(context, value, index));
}

Tuple.prototype.find = function(p) {
    return this.each(function(v, i) {
        if (isMatch(this, p, v, i)) return v; });
};

Tuple.prototype.count = function(p) {
    return this.fold(function(c, v, i) {
        return isMatch(this, p, v, i) ? ++c : c; }, 0);
};

Tuple.prototype.map = function(fn) {
    return Tuple.fromArray(this.fold(function(m, v, i) {
        return m.push(fn.call(this, v, i)), m; }, []));
};

Tuple.prototype.filter = function(fn) {
    return Tuple.fromArray(this.fold(function(m, v, k) {
        return fn.call(this, v, k) && !m.push(v) || m; }, []));
};

Tuple.prototype.fold = function(fn, value) {
    return this.each(function(v, i) {
        value = fn.call(this, value, v, i); }), value;
};

Tuple.prototype.fold1 = function(fn) { return this.drop(1).fold(fn, this[0]); };
Tuple.prototype.pluck = function(name) { return this.map(function(v) { return v[name]; }); };
Tuple.prototype.pick  = function(names) { return this.map(function(v) { return this[v]; }, names); };
Tuple.prototype.index = function() { return this.map(function(v, i) { return tuple(v, i); }); };

Tuple.prototype.zipWith = function() {
    throw Error("not implemented");
};

Tuple.prototype.applyTo = function(fn) {
    return fn.apply(null, this);
};

function is(x, y) { // ECMAScript Harmony Object.is
    return (x === y) ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y;
}

var _ = global._ = (typeof global._ === 'undefined') ? {} : global._;

function isBlank(x) { return x === _ || x === global._; }

Tuple.prototype.matches = function(/*values...*/) { var values = arguments;
    return this.length === arguments.length && this.map(function(v, i) {
        return isBlank(values[i]) || is(v, values[i]); }).hasNone(false);
};

})();

