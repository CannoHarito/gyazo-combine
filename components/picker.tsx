import { css, html } from "hono/helper.ts";
import { FC } from "hono/jsx/index.ts";
import type { GyazoImage } from "../gyazo.ts";

interface Props {
  images?: GyazoImage[];
}
const ImagePanel = (
  { image_id, type, created_at, metadata: { title, desc } }: GyazoImage,
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
  return <>{images.map((i) => <ImagePanel {...i} />)}</>;
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
