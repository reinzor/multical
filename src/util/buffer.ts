export function bufferAppend(buffer: Uint8Array, data: Uint8Array) {
  const newBuffer = new Uint8Array(buffer.length + data.length);
  newBuffer.set(buffer); // copy old data
  newBuffer.set(data, buffer.length); // copy new data after end of old data
  return newBuffer;
}

export function getSubBuffer(buffer: Uint8Array, startByte: number, endByte: number): Uint8Array {
  const startIndex = buffer.findIndex((v) => v === startByte);
  if (startIndex >= 0) {
    const endIndex = buffer.findIndex((v, index) => v === endByte && index > startIndex);
    if (endIndex >= 0) {
      return buffer.subarray(startIndex + 1, endIndex);
    }
  }
  return new Uint8Array();
}
