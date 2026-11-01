import { RoleItem } from "@/components/experience/RoleItem";
import type { Project, Role } from "@/lib/content/types";
import { timelineLanes } from "@/lib/utils/dates";

type TimelineProps = {
  roles: Role[];
  projectsBySlug: Map<string, Pick<Project, "slug" | "title">>;
};

export function Timeline({ roles, projectsBySlug }: TimelineProps) {
  const laned = timelineLanes(roles);
  const byId = new Map(roles.map((r) => [r.id, r]));
  return (
    <ol
      className="relative ml-4 grid gap-5 border-l-2 border-border pl-6 [--lane-offset:0px] md:[--lane-offset:2.5rem]"
      aria-label="Roles, newest first"
    >
      {laned.map((role, index) => (
        <RoleItem
          key={role.id}
          role={role}
          lane={role.lane}
          defaultOpen={index === 0}
          overlapEmployers={role.overlapsWith.map((id) => byId.get(id)?.employer ?? id)}
          relatedProjects={role.relatedProjects
            .map((slug) => projectsBySlug.get(slug))
            .filter((p): p is Pick<Project, "slug" | "title"> => Boolean(p))}
        />
      ))}
    </ol>
  );
}
