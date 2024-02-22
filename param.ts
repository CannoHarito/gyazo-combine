interface Params {
  name: string;
  width: number;
  height: number;
  color: string;
  trim: boolean;
  crop: number;
  // pattern: string;
  // gap: number;
}
const validColorCode = (str: string) => {
  if (str.startsWith("#")) str = str.slice(1);
  return /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str) && `#${str}`;
};
const getParams = (query: Record<string, string>): Params => {
  const name = query.filename || "combine.png";
  const width = +(query.width ?? (
    "w" == query.size && query["size-w"] ||
    "c" == query.size && query["size-c-w"] ||
    0
  ));
  const height = +(query.height ?? (
    "h" == query.size && query["size-h"] ||
    "c" == query.size && query["size-c-h"] ||
    0
  ));
  // console.debug(
  //   { width, height },
  //   Object.entries(query).filter(([key]) => key.startsWith("size")),
  // );
  const color = query.color && validColorCode(query.color) || "#ffffff";
  const trim = query.trim && "off" != query.trim || false;
  let crop = 0;
  if ("r" == query.crop) {
    crop = +(query["crop-r-w"] ?? 1) / +(query["crop-r-h"] ?? 1);
  } else if ("n" == query.crop) {
    crop = Math.min(Math.floor(-(query["crop-n"] ?? 1)), -1);
  } else if (query.crop && "o" != query.crop) {
    const [w, h] = [...query.crop.matchAll(/\d[\d,.]*/g)].map(([str]) => +str);
    crop = h ? w / h : w ?? 0;
  }
  // const gap = +(query.gap ?? query.g ?? 0);
  // return { name, width, height, color, gap };
  return { name, width, height, color, trim, crop };
};
const parseIds = (idStr: string): string[][] =>
  idStr.replaceAll("\r\n", "\n").replace(/(\n?;)?\n?$/, "")
    .split(/\n?;\n?/).map((lineStr) =>
      lineStr.split(/\n?[ \t+]\n?|\n/).map((id) => id || "dummy")
    );

const getDatetime = (str: string) => {
  let obj: { [k: string]: string } = {};
  // gフラグはlastIndexを使うため
  const dateReg = /(20)?(\d\d)\D?(\d\d)\D?(\d\d)/g;
  const dateMatch = dateReg.exec(str);
  if (dateMatch) {
    const [, , yy, MM, dd] = dateMatch;
    const yyyy = `20${yy}`, date = [yyyy, MM, dd].join("-");
    obj = { date, yyyy, yy, MM, dd };
    const timeReg = /(\d\d)\D?(\d\d)\D?(\d\d)/;
    const timeMatch = timeReg.exec(str.slice(dateReg.lastIndex));
    if (timeMatch) {
      const [, hh, mm, ss] = timeMatch;
      const time = [hh, mm, ss].join(":"), datetime = [date, time].join("T");
      obj = { datetime, ...obj, time, hh, mm, ss };
    }
  }
  return obj;
};
const getDatetimeString = (str: string, format = "datetime") => {
  for (const [k, v] of Object.entries(getDatetime(str))) {
    format = format.replaceAll(k, v);
  }
  return format;
};

export { getDatetimeString, getParams, parseIds };
export type { Params };

if (import.meta.main) {
  const filename =
    "Screenshot_2024-02-12-21-07-41-72_0e623178bd998ca87adab497f581e37b.jpg";
  console.log(filename);
  console.log(
    getDatetimeString(filename, "datetime date time yyyy yy MM dd hh mm ss"),
  );
}
