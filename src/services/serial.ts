import { ref } from 'vue';
import { bufferAppend, getSubBuffer } from '../util/buffer';
import hexStringFromByteArray from '../util/hex';

interface Measurement {
  bla: number;
}

enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

const asyncSetTimeout = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

class Serial {
  _commands = ['avg_temp', 'bla', 'omg']

  connectionStatus = ref(ConnectionStatus.DISCONNECTED);

  measurements = ref<Measurement[]>([]);

  requestSerialPort = async (): Promise<any> => {
    const nav = navigator as any;
    if (!('serial' in nav)) {
      throw new Error('Web serial not supported');
    }

    // const filters = [
    //   { usbVendorId: 0x6056, usbProductId: 0x0001 },
    // ];

    return nav.serial.requestPort();
  };

  async consumeMeasurements(port: any, interval = 10, receiveTimeout = 1): Promise<void> {
    const getMeasurements = async () => {
      const writer = port.writable.getWriter();
      const reader = port.readable.getReader();
      const lastGetValuesTime = 0;

      const getValues = async () => {
        const getValue = async () => {
          const write = async () => {
            const data = new Uint8Array([0x80, 0x3f, 0x10, 0x01, 0x00, 0x3c, 0xb2, 0x5f, 0x0d]);
            await writer.write(data);
          };

          const read = async (): Promise<Uint8Array> => {
            const cancelTimeout = setTimeout(() => {
              reader.cancel();
            }, receiveTimeout * 1e3);

            let buffer = new Uint8Array([]);
            for (;;) {
              // eslint-disable-next-line no-await-in-loop
              const result = await reader.read();

              if (result.done) {
                return new Uint8Array();
              }

              buffer = bufferAppend(buffer, result.value);
              const subBuffer = getSubBuffer(buffer, 0x40, 0x0d);
              if (subBuffer.length > 0) {
                clearTimeout(cancelTimeout);
                return subBuffer;
              }
            }
          };

          await write();
          console.log(hexStringFromByteArray(await read()));
        };

        const time = new Date().getTime();
        // eslint-disable-next-line no-restricted-syntax
        for (const command of this._commands) {
          // TODO, fetch command here ..
          // eslint-disable-next-line no-await-in-loop
          await getValue();
        }

        const sleepTime = interval * 1e3 - (new Date().getTime() - time);
        if (sleepTime > 0) {
          await asyncSetTimeout(sleepTime);
        }

        await getValues();
      };

      await getValues();
    };

    this.connectionStatus.value = ConnectionStatus.CONNECTING;
    try {
      await port.open({
        baudRate: 1200,
        stopBits: 2,
      });
      this.connectionStatus.value = ConnectionStatus.CONNECTED;
      await getMeasurements();
    } finally {
      this.connectionStatus.value = ConnectionStatus.DISCONNECTED;
    }
  }
}

export default new Serial();
