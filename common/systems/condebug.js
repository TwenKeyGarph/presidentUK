// consts
console.debugging = true;

// execute
console.debug = function () {
    if (!console.debugging) return;
    console.log.apply(this, arguments)
};


