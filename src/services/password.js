// Code from
// https://gist.github.com/gibatronic/141ab0ee0507cd2c8bd84e12fe9c2097#file-password-js
// Modified to use Buffer.alloc() for better security
const crypto = require("crypto") // only one that should be required

const digest = "sha256"
const iterations = 99999
const keyLength = 32

exports.hash = function (password) {
  const executor = function (resolve, reject) {
    const outerCallback = function (error, salt) {
      if (error) {
        return reject(error)
      }

      const callback = function (error, key) {
        if (error) {
          return reject(error)
        }

        var buffer = new Buffer.alloc(keyLength * 2)

        salt.copy(buffer)
        key.copy(buffer, salt.length)

        resolve(buffer.toString("base64"))
      }

      crypto.pbkdf2(password, salt, iterations, keyLength, digest, callback)
    }

    crypto.randomBytes(keyLength, outerCallback)
  }

  return new Promise(executor)
}

exports.same = function (password, hash) {
  var executor = function (resolve, reject) {
    var buffer = new Buffer.alloc(keyLength * 2, hash, "base64")
    var salt = buffer.slice(0, keyLength)
    var keyA = buffer.slice(keyLength, keyLength * 2)

    var callback = function (error, keyB) {
      if (error) {
        return reject(error)
      }

      resolve(keyA.compare(keyB) === 0)
    }

    crypto.pbkdf2(password, salt, iterations, keyLength, digest, callback)
  }

  return new Promise(executor)
}
