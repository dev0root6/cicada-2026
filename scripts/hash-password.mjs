#!/usr/bin/env node
/**
 * Prints an ADMIN_USER_* value for a password.
 *
 *   node scripts/hash-password.mjs               # generates a random password
 *   node scripts/hash-password.mjs 'my-password' # hashes the one you supply
 */
import crypto from "node:crypto"

const ITERATIONS = 210_000 // OWASP 2023 guidance for PBKDF2-SHA256
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"

function randomPassword(length = 24) {
  const out = []
  const limit = 256 - (256 % ALPHABET.length) // reject above this to stay uniform
  while (out.length < length) {
    for (const byte of crypto.randomBytes(length * 2)) {
      if (byte < limit) {
        out.push(ALPHABET[byte % ALPHABET.length])
        if (out.length === length) break
      }
    }
  }
  return out.join("")
}

const password = process.argv[2] || randomPassword()
const salt = crypto.randomBytes(16)
const derived = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256")

console.log(`password: ${password}`)
console.log(`digest:   pbkdf2:${ITERATIONS}:${salt.toString("hex")}:${derived.toString("hex")}`)
