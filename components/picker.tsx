import { css } from "@hono/hono/css";
import { html } from "@hono/hono/html";
import type { GyazoImage } from "../gyazo.ts";

const pickerClass = css`
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
const Picker = () => (
  <div id="$picker" class={pickerClass}>
    Gyazo Apiから取得中...
    {html`
<script>
  fetch("./picker").then(res=>res.text()).then(html=>{
    $upload.disabled=false;
    $picker.innerText="";
    $picker.insertAdjacentHTML("beforeend",html);
  });
</script>`}
  </div>
);
export default Picker;

interface Props {
  images?: GyazoImage[];
}
export const ImagePanels = ({ images = [] }: Props) => {
  return (
    <>
      {images.map((i) => <ImagePanel key={i.image_id} {...i} />)}
    </>
  );
};
const ImagePanel = (
  { image_id, type, metadata: { title } }: GyazoImage,
) => {
  const id = `${image_id}.${type}`;
  return (
    <div>
      <img src={`https://i.gyazo.com/thumb/300/${image_id}-${type}`} />
      <input readonly value={title ?? ""} />
      <button type="button" onclick={`addId('${id}')`}>追加</button>
    </div>
  );
};
