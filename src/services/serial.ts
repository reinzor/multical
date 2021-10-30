import { computed, ref } from 'vue';
import { bufferAppend, getSubBuffer } from '../util/buffer';
import nullFn from '../util/null-fn';
import Kamstrup402Serializer from './serializers/kamstrup-402-serializer';
import { Command, Serializer, Value } from './serializers/serializer';

interface NameValueMap {
  [name: string]: Value;
}

export interface Measurement {
  date: Date;
  values: NameValueMap;
}

export enum ConnectionStatus {
  DISCONNECTING = 'DISCONNECTING',
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
  _serializer = new Kamstrup402Serializer() as Serializer;

  _disconnectRequest = false;

  connectionStatus = ref<ConnectionStatus>(ConnectionStatus.DISCONNECTED);

  measurements = ref<Measurement[]>([]);

  lastMeasurement = computed(() => this.measurements.value[this.measurements.value.length - 1])

  get commandNames() {
    return this._serializer.commands.map((c) => c.name);
  }

  requestSerialPort = async (): Promise<any> => getSerial().requestPort({ filters: [{ usbVendorId: 6056 }] });

  async connect(port: any, interval = 1, receiveTimeout = 1): Promise<void> {
    this._disconnectRequest = false;

    const getMeasurements = async () => {
      const writer = port.writable.getWriter();
      const reader = port.readable.getReader();

      const getValues = async () => {
        const getValue = async (command: Command): Promise<Value> => {
          const write = async () => {
            await writer.write(command.data);
          };

          const read = async (): Promise<Uint8Array> => {
            const cancelTimeout = setTimeout(() => {
              reader.cancel().catch(nullFn);
            }, receiveTimeout * 1e3);

            let buffer = new Uint8Array([]);
            for (; ;) {
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
          return this._serializer.deserialize(await read());
        };

        const measurement: Measurement = {
          date: new Date(),
          values: {},
        };

        // eslint-disable-next-line no-restricted-syntax
        for (const command of this._serializer.commands) {
          if (this._disconnectRequest) {
            break;
          }
          try {
            // eslint-disable-next-line no-await-in-loop
            measurement.values[command.name] = await getValue(command);
          } catch (e) {
            throw new Error(`Failed to fetch value ${command.name}: ${e}`);
          }
        }

        if (!this._disconnectRequest) {
          this.measurements.value.push(measurement);

          const sleepTime = interval * 1e3 - (new Date().getTime() - measurement.date.getTime());
          if (sleepTime > 0) {
            await asyncSetTimeout(sleepTime);
          }

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
    this.connectionStatus.value = ConnectionStatus.DISCONNECTING;
    this._disconnectRequest = true;
  }
}

export default new Serial();
