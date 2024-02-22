import { Hono, HTTPException } from "hono/mod.ts";
import { css, html, raw } from "hono/helper.ts";
import { parseToken } from "../token.ts";
import { getImages, upload } from "../gyazo.ts";
import { parseIds } from "../param.ts";
import Form from "../components/form.tsx";
import Picker, { pickerClass } from "../components/picker.tsx";

const app = new Hono();
app.get(parseToken, (c) => {
  const accessToken = c.var.token;
  const picker = accessToken
    ? <div id="$picker" class={pickerClass}>Gyazo Apiから取得中...</div>
    : (
      <div>
        <a href="/auth">Gyazo Api のアクセストークンを取得する</a>
      </div>
    );
  const script = html`<script>
const parseIds=${raw(parseIds)};
function idsChange(){
  $preview.innerText = parseIds($ids.value).map(i=>"["+i.map(s=>s.padEnd(36))+"]").join("\\n");
}
$ids.onchange=idsChange;
idsChange();
${
    accessToken && raw`
function addId(id){
  if($ids.value&&/\\S$/.test($ids.value))$ids.value+="\\n";
  $ids.value+=id+"\\n";
  idsChange();
}
fetch("./picker").then(res=>res.text())
  .then(html=>{$picker.innerText="";$picker.insertAdjacentHTML("afterbegin", html)});
$upload.disabled=false;
`
  }
</script>`;
  return c.render(
    <>
      <Form />
      {picker}
      {script}
    </>,
  );
});
app.get("/picker", parseToken, async (c) => {
  const accessToken = c.var.token;
  if (!accessToken) throw new HTTPException(401, { message: "invalid" });
  const res = await getImages({ accessToken });
  // const res = await Promise.resolve({ ok: true, value: [], error: "" });
  if (res.ok) {
    c.var.setToken?.(c);
    return c.html(<Picker images={res.value.filter((i) => i.image_id)} />);
  }
  throw new HTTPException(400, { message: res.error });
});

export default app;
