import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "@/components/site/Markdown";
import { jsonLd } from "@/lib/seo";

const html = (src: string) => renderToStaticMarkup(<Markdown source={src} />);

describe("article text is treated as untrusted", () => {
  it("shows raw HTML as plain text instead of running it", () => {
    const out = html(
      'Hello <script>alert(1)</script> <img src=x onerror=alert(1)> <iframe src="https://evil.example"></iframe>',
    );
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/<iframe/i);
    expect(out).not.toMatch(/<img[^>]+onerror/i);
    expect(out).toContain("&lt;script&gt;");
  });
  it("removes unsafe link and image addresses", () => {
    const out = html(
      "[click](javascript:alert(1)) [data](data:text/html;base64,AAAA) ![x](javascript:alert(1))",
    );
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/data:text/i);
  });
  it("keeps normal links, on-site links and citations working", () => {
    const out = html("[a](https://example.com) [b](/guides/x) [[1]](https://example.com/src)");
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('href="/guides/x"');
    expect(out).toContain('href="#src-1"');
    expect(out).toContain('target="_blank"');
  });
  it("still renders tables and lists", () => {
    const out = html("| a | b |\n|---|---|\n| 1 | 2 |\n\n- one\n- two");
    expect(out).toContain("<table");
    expect(out).toContain("<li>");
  });
  it("structured data cannot be broken out of with </script>", () => {
    const out = jsonLd({ author: "x</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).author).toBe("x</script><script>alert(1)</script>");
  });
});
