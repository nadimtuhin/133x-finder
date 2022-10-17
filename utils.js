export function convertToByte(str) {
  let split = str.split(' ');
  return toBytes(split[0], split[1]);
}

export function toBytes(size, type) {
  const types = ["B", "KB", "MB", "GB", "TB"];
  const key = types.indexOf(type.toUpperCase())
  if (typeof key !== "boolean") {
    return size * 1024 ** key;
  }
  return "invalid type: type must be GB/KB/MB etc.";
}

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function fileSizeConverter(size, fromUnit, toUnit) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const from = units.indexOf(fromUnit.toUpperCase());
  const to = units.indexOf(toUnit.toUpperCase());
  const BASE_SIZE = 1024;
  let result = 0;
  if (from < 0 || to < 0) {
    return result = 'Error: Incorrect units';
  }
  result = from < to ? size / (BASE_SIZE ** to) : size * (BASE_SIZE ** from);
  return result.toFixed(2);
}

export function quantileSorted(values, p, fnValueFrom) {
  var n = values.length;
  if (!n) {
    return;
  }

  fnValueFrom =
    Object.prototype.toString.call(fnValueFrom) == "[object Function]"
      ? fnValueFrom
      : function (x) {
        return x;
      };

  p = +p;

  if (p <= 0 || n < 2) {
    return +fnValueFrom(values[0], 0, values);
  }

  if (p >= 1) {
    return +fnValueFrom(values[n - 1], n - 1, values);
  }

  var i = (n - 1) * p,
    i0 = Math.floor(i),
    value0 = +fnValueFrom(values[i0], i0, values),
    value1 = +fnValueFrom(values[i0 + 1], i0 + 1, values);

  return value0 + (value1 - value0) * (i - i0);
}
