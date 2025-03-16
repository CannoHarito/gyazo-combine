import { html } from "@hono/hono/html";
import { css } from "@hono/hono/css";
import { FC } from "@hono/hono/jsx";
import type { GyazoImage } from "../gyazo.ts";

interface Props {
  images?: GyazoImage[];
}
const ImagePanel = (
  { image_id, type, metadata: { title } }: GyazoImage,
) => {
  const id = `${image_id}.${type}`;
  return (
    <div>
      <img src={`https://gyazo.com/${image_id}/thumb/300`} />
      <input readonly value={title ?? ""} />
      {html`<button type="button" onClick="addId('${id}')">追加</button>`}
    </div>
  );
};
const Picker: FC<Props> = ({ images = [] }) => {
  return <>{images.map((i) => <ImagePanel key={i.image_id} {...i} />)}</>;
};
export default Picker;
export const pickerClass = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-end;
  & > div{
    width: 300px;
    margin: 5px;
    display: flex;
    flex-direction: column;
  }
`;
