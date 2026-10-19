import { useEffect, useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { SelectField } from "@/components/fields";
import { faqs, lessons } from "@/lib/benefits/library";
import { loadLessons, saveLessons } from "@/lib/benefits/storage";
import { DeskShots } from "@/components/desk-shots";

export function LearnView() {
  const [topic, setTopic] = useState("All");
  const [openId, setOpenId] = useState<string | null>(lessons[0]?.id ?? null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [read, setRead] = useState<string[]>([]);
  const topics = ["All", ...Array.from(new Set([...lessons.map((l) => l.category), ...faqs.map((f) => f.category)]))];
  const shownLessons = lessons.filter((lesson) => topic === "All" || lesson.category === topic);
  const shownFaqs = faqs.filter((faq) => topic === "All" || faq.category === topic);

  useEffect(() => {
    setRead(loadLessons());
  }, []);

  function toggleRead(id: string) {
    const next = read.includes(id) ? read.filter((item) => item !== id) : [...read, id];
    setRead(next);
    saveLessons(next);
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8">
      <p className="text-sm font-semibold tracking-wide text-brass uppercase">Lessons</p>
      <h2 className="mt-1 font-serif text-3xl text-ink">Short briefings, then the official film</h2>
      <p className="mt-2 text-pretty text-muted">
        Films are from the TRICARE and VA channels. A checked lesson stays on this device.
      </p>
      <div className="mt-4">
        <DeskShots />
      </div>
      <div className="mt-4">
        <SelectField label="Topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
          {topics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>
      </div>
      <p className="mt-3 text-sm text-muted">
        {read.length} of {lessons.length} lessons marked read
      </p>

      <div className="mt-4 grid gap-3">
        {shownLessons.map((lesson) => {
          const open = openId === lesson.id;
          return (
            <article key={lesson.id} className="panel overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : lesson.id)}
                className="flex min-h-11 w-full items-start justify-between gap-3 p-4 text-left"
                aria-expanded={open}
              >
                <span>
                  <span className="block text-sm font-semibold text-brass">
                    {lesson.category} · {lesson.minutes}
                    {read.includes(lesson.id) ? " · Read" : ""}
                  </span>
                  <span className="mt-1 block font-serif text-2xl text-ink">{lesson.title}</span>
                </span>
              </button>
              {open ? (
                <div className="border-t border-line px-4 pb-4">
                  <ol className="mt-3 grid gap-3">
                    {lesson.beats.map((beat, index) => (
                      <li key={beat} className="flex gap-3 text-pretty">
                        <span className="font-serif text-xl text-brass tabular-nums">{index + 1}</span>
                        <span>{beat}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 border border-line bg-tint p-3 text-sm text-pretty">
                    <span className="font-semibold">Do this. </span>
                    {lesson.doThis}
                  </p>
                  {lesson.videoId ? (
                    playing === lesson.id ? (
                      <div className="mt-4 aspect-video w-full bg-ink">
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0`}
                          title={lesson.videoTitle ?? lesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlaying(lesson.id)}
                        className="drive mt-4 inline-flex items-center gap-2 px-4"
                      >
                        <Play className="size-4" aria-hidden="true" />
                        Play: {lesson.videoTitle}
                      </button>
                    )
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={lesson.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1 font-semibold text-field underline"
                    >
                      {lesson.link.label}
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                    {lesson.videoId ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${lesson.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center font-semibold text-field underline"
                      >
                        Open the film on YouTube
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleRead(lesson.id)}
                      className="min-h-11 border border-line px-3 text-sm font-semibold"
                    >
                      {read.includes(lesson.id) ? "Mark unread" : "Mark as read"}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <h3 className="mt-8 font-serif text-2xl text-ink">Questions people ask the wrong office</h3>
      <div className="mt-3 grid gap-2">
        {shownFaqs.map((faq) => (
          <details key={faq.id} className="panel p-4">
            <summary className="cursor-pointer text-base font-semibold">{faq.q}</summary>
            <p className="mt-3 text-pretty">{faq.a}</p>
            <a
              href={faq.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-1 font-semibold text-field underline"
            >
              {faq.link.label}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </details>
        ))}
      </div>
    </section>
  );
}
