import { css } from "hono/helper.ts";
import type { Child } from "hono/jsx/index.ts";

const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

const flexRow = css`
  display: flex;
  flex-wrap: wrap;
  &>*{
    flex-grow:1;
  }
`;

const formClass = css`
  ${flexColumn}
  input[type=number]{
    width: 4em;
  }
  textarea{
    resize: vertical;
  }
`;
const previerClass = css`
  overflow: auto;
  padding: 5px;
`;

export default function Form() {
  return (
    <>
      <form name="render" method="GET" action="/render" class={formClass}>
        <div class={flexRow}>
          <fieldset>
            <legend>
              出力解像度
            </legend>
            <Radio name="size" value="o" label="オリジナル"></Radio>
            <Radio name="size" value="w" label="横">
              <input type="number" name="size-w" value={1920} />
            </Radio>
            <Radio name="size" value="h" label="縦" checked>
              <input type="number" name="size-h" value={1080} />
            </Radio>
            <Radio name="size" value="c" label="クロップ">
              <span>
                縦<input type="number" name="size-c-w" value={1920} />
              </span>
              <span>
                横<input type="number" name="size-c-h" value={1080} />
              </span>
            </Radio>
          </fieldset>
          <fieldset>
            <legend>
              黒帯トリミング
            </legend>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="trim"
                  checked
                />4方向から検査する
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="trim-cache"
                  checked
                />検査結果をキャッシュ
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              クロップ
            </legend>
            <Radio name="crop" value="o" label="オリジナル"></Radio>
            <Radio name="crop" value="r" label="比率を指定" checked>
              <span>
                横<input type="number" name="crop-r-w" value={16} />
              </span>
              <span>
                縦<input type="number" name="crop-r-h" value={9} />
              </span>
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
        <textarea id="$ids" name="ids" style="width:100%" rows={8}></textarea>
        <div class={flexRow}>
          <button>結合画像表示</button>
          <button formmethod="POST" disabled id="$upload">
            Gyazoにアップロード
          </button>
        </div>
        <pre id="$preview" class={previerClass}></pre>
      </form>
    </>
  );
}

const marginClass = css`
  & > *:not(:first-child){
    margin-left:1em;
  }
`;

interface RadioOption {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  children?: Child;
}
const Radio = ({ children, label, ...init }: RadioOption) => (
  <div class={marginClass}>
    <label>
      <input type="radio" {...init} />
      {label}
    </label>
    {children}
  </div>
);
