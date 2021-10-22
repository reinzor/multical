import { ref } from 'vue';

interface Measurement {
  bla: number;
}

enum ConnectionStatusState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

interface ConnectionStatus {
  state: ConnectionStatusState;
  error: string;
}

class Serial {
  connectionStatus = ref<ConnectionStatus>({
    state: ConnectionStatusState.DISCONNECTED,
    error: '',
  });

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

  connect(port: any): void {
    const readValue = async () => {
      const writer = port.writable.getWriter();
      const data = new Uint8Array([0x80, 0x3f, 0x10, 0x01, 0x00, 0x3c, 0xb2, 0x5f, 0x0d]);
      console.log('writing ..');
      await writer.write(data);
    };

    console.log('Connecting to', this, port);
    this.connectionStatus.value.state = ConnectionStatusState.CONNECTING;
    this.connectionStatus.value.error = '';
    port.open({
      baudRate: 1200,
      stopBits: 2,
    }).then(() => {
      console.log('Connected');
      this.connectionStatus.value.state = ConnectionStatusState.CONNECTED;

      setInterval(() => {
        readValue();
      }, 4000);
    }).catch((e: any) => {
      console.log('Disconnected');
      this.connectionStatus.value.state = ConnectionStatusState.DISCONNECTED;
      this.connectionStatus.value.error = `Failed to connect: ${e}`;
    });
  }
}

export default new Serial();
