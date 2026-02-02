import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);

/**
 * Compresses an XML string using GZip and then encodes it in Base64.
 *
 * @param xml The input XML string.
 * @returns A promise that resolves with the Base64 encoded GZipped string.
 */
export async function compressAndEncodeXml(xml: string): Promise<string> {
  const buffer = Buffer.from(xml, 'utf-8');
  const compressedBuffer = await gzip(buffer);
  return compressedBuffer.toString('base64');
}
