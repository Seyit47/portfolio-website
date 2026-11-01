import { Reveal } from "@/components/motion/Reveal";
import type { SkillGroup } from "@/lib/content/types";

const LEVEL: Record<SkillGroup["skills"][number]["level"], { label: string; dots: number }> = {
  primary: { label: "Primary", dots: 3 },
  working: { label: "Working", dots: 2 },
  familiar: { label: "Familiar", dots: 1 },
};

export function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => (
        <Reveal key={group.id} index={index % 3}>
          <section
            aria-labelledby={`skills-${group.id}`}
            className="h-full rounded-lg border border-border bg-bg-elevated p-5"
            data-testid="skill-group"
          >
            <h3 id={`skills-${group.id}`} className="font-display text-base font-semibold text-fg">
              {group.name}
            </h3>
            <ul className="mt-4 grid gap-2">
              {group.skills.map((skill) => {
                const level = LEVEL[skill.level];
                return (
                  <li
                    key={skill.name}
                    className="flex items-center justify-between gap-3 text-sm"
                    data-testid="skill"
                  >
                    <span className="text-fg">{skill.name}</span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-fg-subtle">
                      <span className="flex gap-0.5" aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`size-1.5 rounded-full ${i < level.dots ? "bg-accent" : "bg-border-strong"}`}
                          />
                        ))}
                      </span>
                      <span data-level-label>{level.label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
