import { MDXContent as CCMDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/components/projects/mdx-components";

export function MDXContent({ code }: { code: string }) {
  return <CCMDXContent code={code} components={mdxComponents} />;
}
