import { ref } from 'vue';
import { bufferAppend, getSubBuffer } from '../util/buffer';
import hexStringFromByteArray from '../util/hex';
import nullFn from '../util/null-fn';

interface Measurement {
  bla: number;
}

enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

const asyncSetTimeout = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const getSerial = (): any => {
  const nav = navigator as any;
  if (!('serial' in nav)) {
    throw new Error('Web serial not supported');
  }
  return nav.serial;
};

class Serial {
  _commands = ['avg_temp', 'bla', 'omg']

  _disconnectRequest = false

  connectionStatus = ref(ConnectionStatus.DISCONNECTED);

  measurements = ref<Measurement[]>([]);

  requestSerialPort = async (): Promise<any> => getSerial().requestPort();

  async connect(port: any, interval = 0, receiveTimeout = 1): Promise<void> {
    this._disconnectRequest = false;

    const getMeasurements = async () => {
      const writer = port.writable.getWriter();
      const reader = port.readable.getReader();

      const getValues = async () => {
        const getValue = async () => {
          const write = async () => {
            const data = new Uint8Array([0x80, 0x3f, 0x10, 0x01, 0x00, 0x3c, 0xb2, 0x5f, 0x0d]);
            await writer.write(data);
          };

          const read = async (): Promise<Uint8Array> => {
            const cancelTimeout = setTimeout(() => {
              reader.cancel().catch(nullFn);
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

        if (!this._disconnectRequest) {
          await getValues();
        } else {
          writer.releaseLock();
          reader.releaseLock();
        }
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
    port.close();
  }

  disconnect() {
    this._disconnectRequest = true;
  }
}

export default new Serial();
