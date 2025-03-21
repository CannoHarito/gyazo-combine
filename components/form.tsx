import { css } from "@hono/hono/css";
import type { PropsWithChildren } from "@hono/hono/jsx";
import { raw } from "@hono/hono/html";
import { parseIds } from "../param.ts";

const flexRow = css`
  display: flex;
  flex-wrap: wrap;
  & > * {
    flex-grow:1;
  }
`;

const formClass = css`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  input[type="number"] {
    width: 4em;
    text-align: center;
  }
  input[type="color"] {
    width: 100%;
  }
  textarea {
    resize: vertical;
  }
`;
const buttonClass = css`
  display: inline-block;
  padding: 0.375em 0.75em;
  margin: 0 0.5em;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  background-color: #0d6efe;
  border-radius: 0.375em;
  border: none;
  &:hover {
    background-color: #0b5ed7;
  }
`;
const button2ndClass = css`
  ${buttonClass}
  background-color: #6c757d;
  &:hover {
    background-color: #5c636a;
  }
`;
const previerClass = css`
  overflow: auto;
  padding: 5px;
`;

export default function Form() {
  return (
    <form name="render" method="get" action="/render" class={formClass}>
      <div class={flexRow}>
        <fieldset>
          <legend>出力解像度</legend>
          <Radio name="size" value="o" label="オリジナル"></Radio>
          <Radio name="size" value="w" label="横">
            <input type="number" name="size-w" value={1920} />
          </Radio>
          <Radio name="size" value="h" label="縦" checked>
            <input type="number" name="size-h" value={1080} />
          </Radio>
          <Radio name="size" value="c" label="クロップ">
            横<input type="number" name="size-c-w" value={1920} />
            縦<input type="number" name="size-c-h" value={1080} />
          </Radio>
        </fieldset>
        <fieldset>
          <legend>黒帯トリミング</legend>
          <Checkbox name="trim" label="4方向から検査する" checked />
          <Checkbox name="trim-cache" label="同じサイズならスキップ" checked />
        </fieldset>
        <fieldset>
          <legend>
            クロップ
          </legend>
          <Radio name="crop" value="o" label="オリジナル"></Radio>
          <Radio name="crop" value="r" label="比率を指定" checked>
            横<input type="number" name="crop-r-w" value={16} />
            縦<input type="number" name="crop-r-h" value={9} />
          </Radio>
          <Radio name="crop" value="n" label="N枚目を基準">
            <input type="number" name="crop-n" value={1} />
          </Radio>
        </fieldset>
        <fieldset>
          <legend>
            背景色
          </legend>
          <div>
            <input type="color" name="color" value="#FFFFFF" />
          </div>
        </fieldset>
      </div>
      <textarea
        id="$ids"
        name="ids"
        style="width:100%"
        rows={8}
        onchange="idsChange()"
      >
      </textarea>
      <div class={flexRow}>
        <button type="submit" class={button2ndClass}>結合画像表示</button>
        <button
          type="submit"
          formmethod="post"
          disabled
          id="$upload"
          class={buttonClass}
        >
          Gyazoにアップロード
        </button>
      </div>
      <pre id="$preview" class={previerClass}></pre>
      {script}
    </form>
  );
}

const script = raw(String.raw`
  <script>
    const parseIds=${parseIds};
    function idsChange(){
      $preview.innerText = parseIds($ids.value).map(i=>"["+i.map(s=>s.padEnd(36))+"]").join("\n");
    }
    idsChange();
    function addId(id){
      if($ids.value&&/\S$/.test($ids.value))$ids.value+="\n";
      $ids.value+=id+"\n";
      idsChange();
    }
  </script>`);

interface InputOption {
  name: string;
  value?: string;
  label: string;
  checked?: boolean;
}
const Input = (
  { children, label, ...init }: PropsWithChildren<
    InputOption & { type: "radio" | "checkbox" }
  >,
) => (
  <div class={flexRow}>
    <label>
      <input {...init} />
      {label}
    </label>
    {children}
  </div>
);
const Radio = (init: PropsWithChildren<InputOption>) => (
  <Input {...init} type="radio" />
);
const Checkbox = (init: PropsWithChildren<InputOption>) => (
  <Input {...init} type="checkbox" />
);
