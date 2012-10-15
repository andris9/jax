var jax = require("../index"),
    inputJSON = require("fs").readFileSync(__dirname+"/input.json", "utf-8");

console.log(jax(inputJSON));