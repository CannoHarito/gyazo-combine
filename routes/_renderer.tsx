import { css, Style } from "hono/helper.ts";
import { jsxRenderer } from "hono/middleware.ts";

const repoUrl = "https://github.com/CannoHarito/gyazo-combine";

export default jsxRenderer(({ children, title }) => {
  const headerClass = css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    & a {
      color: inherit;
      text-decoration: none;
    }
  `;
  const linkClass = css`
    font-weight: bold;
    &:hover{
      text-decoration: underline;
    }
  `;
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
      <header class={headerClass}>
        <h1>
          <a href="/">GyazoCombine</a>
        </h1>
        <nav>
          <a href={repoUrl} class={linkClass}>GitHub</a>
        </nav>
      </header>
      {children}
    </>
  );
}, { docType: `<!DOCTYPE html>\n` });
