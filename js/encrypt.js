(function () {
  window.__shortcodes = window.__shortcodes || {};
  window.__shortcodes.encrypt = window.__shortcodes.encrypt || {};

  if (window.__shortcodes.encrypt.ready) return;
  window.__shortcodes.encrypt.ready = true;

  function rotateLeft(value, shift) {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(a, b) {
    return (a + b) >>> 0;
  }

  function toUtf8Bytes(value) {
    return new TextEncoder().encode(String(value || ""));
  }

  function md5(value) {
    const bytes = toUtf8Bytes(value);
    const originalLength = bytes.length;
    const withPadding = originalLength + 1;
    const paddedLength = Math.ceil((withPadding + 8) / 64) * 64;
    const buffer = new Uint8Array(paddedLength);
    const words = new Uint32Array(buffer.buffer);
    const shifts = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    const constants = new Uint32Array(64);

    buffer.set(bytes);
    buffer[originalLength] = 0x80;

    const bitLength = originalLength * 8;
    words[paddedLength / 4 - 2] = bitLength >>> 0;
    words[paddedLength / 4 - 1] = Math.floor(bitLength / 0x100000000);

    for (let i = 0; i < 64; i += 1) {
      constants[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
    }

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    for (let offset = 0; offset < words.length; offset += 16) {
      let a = a0;
      let b = b0;
      let c = c0;
      let d = d0;

      for (let i = 0; i < 64; i += 1) {
        let f;
        let g;

        if (i < 16) {
          f = (b & c) | (~b & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | (~d & c);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3 * i + 5) % 16;
        } else {
          f = c ^ (b | ~d);
          g = (7 * i) % 16;
        }

        const temp = d;
        const shift = shifts[Math.floor(i / 16) * 4 + (i % 4)];
        d = c;
        c = b;
        b = addUnsigned(b, rotateLeft(addUnsigned(addUnsigned(a, f), addUnsigned(constants[i], words[offset + g])), shift));
        a = temp;
      }

      a0 = addUnsigned(a0, a);
      b0 = addUnsigned(b0, b);
      c0 = addUnsigned(c0, c);
      d0 = addUnsigned(d0, d);
    }

    return [a0, b0, c0, d0]
      .map(function (word) {
        return [word & 0xff, (word >>> 8) & 0xff, (word >>> 16) & 0xff, (word >>> 24) & 0xff]
          .map(function (byte) {
            return byte.toString(16).padStart(2, "0");
          })
          .join("");
      })
      .join("");
  }

  function base64ToBytes(value) {
    const binary = window.atob(String(value || "").replace(/\s+/g, ""));
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  async function decryptContent(encrypted, password) {
    const hashed = md5(password);
    const keyBytes = toUtf8Bytes(hashed);
    const ivBytes = toUtf8Bytes(hashed.slice(0, 16));
    const key = await window.crypto.subtle.importKey("raw", keyBytes, { name: "AES-CBC" }, false, ["decrypt"]);
    const decrypted = await window.crypto.subtle.decrypt({ name: "AES-CBC", iv: ivBytes }, key, base64ToBytes(encrypted));

    return new TextDecoder().decode(decrypted);
  }

  function getStorageKey(container, index) {
    return window.location.pathname + ".encrypt." + index;
  }

  async function unlock(container, password, storageKey) {
    const content = container.querySelector("[data-encrypt-content]");
    const error = container.querySelector("[data-encrypt-error]");
    if (!content) return;

    try {
      const decrypted = await decryptContent(content.textContent, password);
      if (!decrypted) throw new Error("Empty decrypted content.");

      const fragment = document.createElement("div");
      fragment.innerHTML = decrypted;
      container.replaceWith(fragment);
      window.sessionStorage.setItem(storageKey, password);
    } catch (errorValue) {
      if (error) {
        error.classList.remove("hidden");
      }
    }
  }

  function setupEncrypt(container, index) {
    const form = container.querySelector("[data-encrypt-form]");
    const input = container.querySelector("[data-encrypt-password]");
    const error = container.querySelector("[data-encrypt-error]");
    const storageKey = getStorageKey(container, index);
    const savedPassword = window.sessionStorage.getItem(storageKey);

    if (savedPassword) {
      unlock(container, savedPassword, storageKey);
      return;
    }

    if (!form || !input) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (error) {
        error.classList.add("hidden");
      }

      unlock(container, input.value, storageKey);
    });
  }

  function initEncryptBlocks() {
    if (!window.crypto || !window.crypto.subtle) return;

    document.querySelectorAll("[data-encrypt]").forEach(function (container, index) {
      setupEncrypt(container, index);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEncryptBlocks);
  } else {
    initEncryptBlocks();
  }
})();
