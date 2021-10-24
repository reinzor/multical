/* eslint-disable no-bitwise, no-restricted-properties */

import hexStringFromByteArray from '@/util/hex';

import { Command, Serializer, Value } from './serializer';

export default class Kamstrup402Serializer extends Serializer {
  _unitMap = new Map<number, string>([
    [0, ''],
    [1, 'Wh'],
    [2, 'kWh'],
    [3, 'MWh'],
    [4, 'GWh'],
    [5, 'j'],
    [6, 'kj'],
    [7, 'Mj'],
    [8, 'Gj'],
    [9, 'Cal'],
    [10, 'kCal'],
    [11, 'Mcal'],
    [12, 'Gcal'],
    [13, 'varh'],
    [14, 'kvarh'],
    [15, 'Mvarh'],
    [16, 'Gvarh'],
    [17, 'VAh'],
    [18, 'kVAh'],
    [19, 'MVAh'],
    [20, 'GVAh'],
    [21, 'kW'],
    [22, 'kW'],
    [23, 'MW'],
    [24, 'GW'],
    [25, 'kvar'],
    [26, 'kvar'],
    [27, 'Mvar'],
    [28, 'Gvar'],
    [29, 'VA'],
    [30, 'kVA'],
    [31, 'MVA'],
    [32, 'GVA'],
    [33, 'V'],
    [34, 'A'],
    [35, 'kV'],
    [36, 'kA'],
    [37, 'C'],
    [38, 'K'],
    [39, 'l'],
    [40, 'm3'],
    [41, 'l/h'],
    [42, 'm3/h'],
    [43, 'm3xC'],
    [44, 'ton'],
    [45, 'ton/h'],
    [46, 'h'],
    [47, 'hh:mm:ss'],
    [48, 'yy:mm:dd'],
    [49, 'yyyy:mm:dd'],
    [50, 'mm:dd'],
    [51, ''],
    [52, 'bar'],
    [53, 'RTC'],
    [54, 'ASCII'],
    [55, 'm3 x 10'],
    [56, 'ton x 10'],
    [57, 'GJ x 10'],
    [58, 'minutes'],
    [59, 'Bitfield'],
    [60, 's'],
    [61, 'ms'],
    [62, 'days'],
    [63, 'RTC-Q'],
    [64, 'Datetime'],
  ]);

  constructor() {
    super([
      new Command('HeatEnergy_E1', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x3c, 0xb2, 0x5f, 0xd]),
      new Command('Power', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x50, 0x1f, 0x75, 0xd]),
      new Command('Temp1', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x56, 0x7f, 0xb3, 0xd]),
      new Command('Temp2', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x57, 0x6f, 0x92, 0xd]),
      new Command('Tempdiff', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x59, 0x8e, 0x5c, 0xd]),
      new Command('Flow', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x4a, 0xac, 0xe, 0xd]),
      new Command('Volume', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x44, 0x4d, 0xc0, 0xd]),
      // new Command('MinFlow_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x8d, 0x5, 0xa5, 0xd]),
      // new Command('MaxFlow_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x8b, 0x65, 0x63, 0xd]),
      // new Command('MinFlowDate_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x8c, 0x15, 0x84, 0xd]),
      // new Command('MaxFlowDate_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x8a, 0x75, 0x42, 0xd]),
      // new Command('MinPower_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x91, 0xd6, 0x18, 0xd]),
      // new Command('MaxPower_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x8f, 0x25, 0xe7, 0xd]),
      // new Command('AvgTemp1_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x95, 0x96, 0x9c, 0xd]),
      // new Command('AvgTemp2_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x96, 0xa6, 0xff, 0xd]),
      // new Command('MinPowerDate_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x90, 0xc6, 0x39, 0xd]),
      // new Command('MaxPowerDate_M', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x8e, 0x35, 0xc6, 0xd]),
      // new Command('MinFlow_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x7e, 0xda, 0xd9, 0xd]),
      // new Command('MaxFlow_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x7c, 0xfa, 0x9b, 0xd]),
      // new Command('MinFlowDate_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x7d, 0xea, 0xba, 0xd]),
      // new Command('MaxFlowDate_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x7b, 0x8a, 0x7c, 0xd]),
      // new Command('MinPower_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x82, 0xf4, 0x4a, 0xd]),
      // new Command('MaxPower_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x1b, 0x7f, 0xd4, 0x8, 0xd]),
      // new Command('AvgTemp1_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x92, 0xe6, 0x7b, 0xd]),
      // new Command('AvgTemp2_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x93, 0xf6, 0x5a, 0xd]),
      // new Command('MinPowerDate_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x81, 0xc4, 0x29, 0xd]),
      // new Command('MaxPowerDate_Y', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x7f, 0xca, 0xf8, 0xd]),
      // new Command('Temp1xm3', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x61, 0x39, 0x7, 0xd]),
      // new Command('Temp2xm3', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x6e, 0xc8, 0xe8, 0xd]),
      // new Command('InfoEvent', [0x80, 0x3f, 0x10, 0x1, 0x0, 0x71, 0x2b, 0x36, 0xd]),
      // new Command('HourCounter', [0x80, 0x3f, 0x10, 0x1, 0x3, 0xec, 0x2c, 0x71, 0xd]),
    ]);
  }

  _unstuffData = (data: Uint8Array): Uint8Array => {
    const unstuffedData: number[] = [];
    for (let i = 0; i < data.length; i += 1) {
      if (data[i] === 0x1b && i < data.length + 1) {
        // eslint-disable-next-line no-bitwise
        const v = data[i + 1] ^ 0xff;
        i += 1;
        unstuffedData.push(v);
      } else {
        unstuffedData.push(data[i]);
      }
    }
    return new Uint8Array(unstuffedData);
  };

  deserialize(data: Uint8Array): Value {
    const unstuffedData = this._unstuffData(data);

    if (unstuffedData.length !== 13) {
      throw new Error(`Invalid data length: ${unstuffedData.length} !== 13: ${hexStringFromByteArray(unstuffedData)}`);
    }

    const getScalar = (): number => {
      const getMantissa = (length: number): number => {
        const offset = 7;
        if (offset + length >= unstuffedData.length - 1) {
          throw new Error(`getMantissa invalid length ${length} for data ${hexStringFromByteArray(unstuffedData)}`);
        }
        let x = 0;
        for (let i = 0; i < length; i += 1) {
          x <<= 8;
          x |= unstuffedData[offset + i];
        }
        return x;
      };
      const getExponent = (byte: number): number => {
        let i = byte & 0x3f;
        if (byte & 0x40) {
          i = -i;
        }
        i = Math.pow(10, i);
        if (byte & 0x80) {
          i = -i;
        }
        return i;
      };
      return getMantissa(unstuffedData[5]) * getExponent(unstuffedData[6]);
    };

    return new Value(getScalar(), this._unitMap.get(unstuffedData[4]) || '');
  }
}
