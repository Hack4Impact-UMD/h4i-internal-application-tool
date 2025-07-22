import Markdown, { Options } from "react-markdown";

export default function FormMarkdown({ children, components }: Options) {
  if (!children) return <></>;

  return (
    <div className="mb-2.5 text-sm text-muted-foreground">
      <Markdown
        components={{
          a: (opts) => (
            <a
              className="underline text-blue"
              href={opts.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {opts.children}
            </a>
          ),
          ul: (opts) => (
            <ul className="list-disc list-inside">{opts.children}</ul>
          ),
          ol: (opts) => (
            <ol className="list-decimal list-inside">{opts.children}</ol>
          ),
          ...components,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
