export default function parseAttributes(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => parseAttributes(item));
  }

  if (typeof data === "object" && data) {
    if (data.id !== undefined && data.attributes !== undefined) {
      return { id: data.id, ...parseAttributes(data.attributes) };
    }

    if (data.data !== undefined) {
      return parseAttributes(data.data);
    }

    const parsedData: any = {};
    const keys = Object.keys(data);
    for (const key of keys) {
      parsedData[key] = parseAttributes(data[key]);
    }

    return parsedData;
  } else return data;
}
