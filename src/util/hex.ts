export default function hexStringFromByteArray(byteArray: Uint8Array): string {
  // eslint-disable-next-line no-bitwise
  const byteToHex = (byte: number): string => (`0x${(byte & 0xFF).toString(16)}`);
  return Array.from(byteArray, byteToHex).join(' ');
}
