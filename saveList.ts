import { getImages } from "./gyazo.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const accessToken = Deno.env.get("GYAZO_TOKEN") ||
    prompt("Enter Gyazo access_token:");
  if (!accessToken) throw new Error("Gyazo access_token is not found");
  const res = await getImages({ accessToken });
  if (!res.ok) throw new Error(res.error);
  const images = res.value.filter((i) => i.url);
  console.log(images.slice(0, 6));
  const olds = JSON.parse(
    await Deno.readTextFile("./images.json"),
  ) as { image_id: string }[];

  await Deno.writeTextFile(
    "./images.json",
    JSON.stringify(
      [...new Map([...images, ...olds].map((i) => [i.image_id, i]))
        .values()],
      undefined,
      2,
    ),
  );
}
