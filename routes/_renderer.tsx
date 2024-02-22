import { css, Style } from "hono/helper.ts";
import { jsxRenderer } from "hono/middleware.ts";

export default jsxRenderer(({ children, title }) => {
  return (
    <>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title ?? "GyazoCombine"}</title>
      <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      <Style>
        {css`
* {box-sizing: border-box;}
body { max-width: 60em; margin: auto;}
`}
      </Style>
      {`\n\n`}
      <header>
        <h1>GyazoCombine</h1>
      </header>
      {children}
    </>
  );
}, { docType: `<!DOCTYPE html>\n` });
