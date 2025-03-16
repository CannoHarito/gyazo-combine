import { css, Style } from "@hono/hono/css";
import { jsxRenderer } from "@hono/hono/jsx-renderer";

const repoUrl = "https://github.com/CannoHarito/gyazo-combine";
const globalClass = css`
  :root {
    color-scheme: light dark;
    color: light-dark(#212529, #adb5bd);
    background-color: light-dark(#efedea, #212529);
    font: 1em/1.6 "Segoe UI","BIZ UDPGothic", sans-serif;
  }
  * {
    box-sizing: border-box;
  }
  body {
    max-width: 60em;
    margin: auto;
    padding: 0 .5em;
    min-height: 90vh;
  }
  button, input {
    font-family: inherit;
  }
`;
const headerClass = css`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  & a {
    color: inherit;
    text-decoration: none;
  }
  & > nav > a {
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
`;
export default jsxRenderer(({ children, title, heads }) => {
  return (
    <>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title ?? "GyazoCombine"}</title>
      <Style>{globalClass}</Style>
      {heads}
      {`\n\n`}
      <header class={headerClass}>
        <h1>
          <a href="/">GyazoCombine</a>
        </h1>
        <nav>
          <a href={repoUrl}>GitHub</a>
        </nav>
      </header>
      {children}
    </>
  );
}, { docType: `<!DOCTYPE html>\n` });
