export const encodeToBase64 = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('base64');

export const decodeFromBase64 = (base64: string): Uint8Array => {
  const buf = Buffer.from(base64, 'base64');
  return new Uint8Array(buf);
};

// This regex is designed to be as flexible as possible. It will parse certain
// invalid data URIs.
const DATA_URI_PREFIX_REGEX = /^(data)?:?([\w\/\+]+)?;?(charset=[\w-]+|base64)?.*,/i;

/**
 * If the `dataUri` input is a data URI, then the data URI prefix must not be
 * longer than 100 characters, or this function will fail to decode it.
 *
 * @param dataUri a base64 data URI or plain base64 string
 * @returns a Uint8Array containing the decoded input
 */
export const decodeFromBase64DataUri = (dataUri: string): Uint8Array => {
  const trimmedUri = dataUri.trim();

  const prefix = trimmedUri.substring(0, 100);
  const res = prefix.match(DATA_URI_PREFIX_REGEX);

  // Assume it's not a data URI - just a plain base64 string
  if (!res) return decodeFromBase64(trimmedUri);

  // Remove the data URI prefix and parse the remainder as a base64 string
  const [fullMatch] = res;
  const data = trimmedUri.substring(fullMatch.length);

  return decodeFromBase64(data);
};
