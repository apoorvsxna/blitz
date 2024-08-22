export function convertToEncodedFormat(hexString) {
    return hexString.match(/.{1,2}/g)
      .map(pair => `%${pair.toUpperCase()}`)
      .join('');
  }
  