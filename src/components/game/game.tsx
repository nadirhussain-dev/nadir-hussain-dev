'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { LEVELS, STATIONS } from '@/data/quest';
import { collectedCount, roadPosition, stationAt, stationX } from '@/lib/game/world';
import { Landmark } from './landmarks';
import { ProjectDetails, type ProjectView } from './project-details';

const CHEST_COUNT = STATIONS.filter((station) => station.slug).length;

/**
 * The resume, played as a side-scroller.
 *
 * Scrolling the page drives the kart along the road. The position is written
 * straight to CSS variables, so only level changes go through React. All the
 * content is repeated in plain form in the resume below, which is where reduced
 * motion, recruiters in a hurry and search engines end up.
 */
export function Game({
  projects,
  resumeHref,
}: {
  projects: readonly ProjectView[];
  resumeHref: string | null;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [station, setStation] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [openProject, setOpenProject] = useState<ProjectView | null>(null);

  const current = STATIONS[station] ?? STATIONS[0];
  const project = projects.find((item) => item.slug === current?.slug);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const update = (): void => {
      frame = 0;
      const box = wrapper.current;
      const scene = stage.current;
      if (!box || !scene) return;
      const position = roadPosition(
        window.scrollY,
        box.offsetTop,
        box.offsetHeight - window.innerHeight,
        STATIONS.length,
      );
      scene.style.setProperty('--x', `${position}px`);
      scene.style.setProperty('--spin', `${position * 0.6}deg`);
      if (position !== last) {
        scene.dataset.moving = 'true';
        scene.dataset.facing = position < last ? 'back' : 'forward';
        clearTimeout(idle);
        idle = setTimeout(() => {
          scene.dataset.moving = 'false';
        }, 160);
      }
      last = position;
      const reached = stationAt(position, STATIONS.length);
      setStation(reached);
      setFurthest((value) => Math.max(value, reached));
    };
    const queue = (): void => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, dialog')) return;
      const box = wrapper.current;
      if (!box || window.scrollY > box.offsetTop + box.offsetHeight) return;
      const step = (box.offsetHeight - window.innerHeight) / (STATIONS.length - 1);
      window.scrollBy({
        top: event.key === 'ArrowRight' ? step : -step,
        behavior: 'smooth',
      });
    };

    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      window.removeEventListener('keydown', onKey);
      clearTimeout(idle);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (openProject) dialog.current?.showModal();
  }, [openProject]);

  const collected = collectedCount(STATIONS, furthest);

  return (
    <section id="identity" aria-labelledby="game-title" ref={wrapper} className="game">
      <div
        ref={stage}
        className="game-stage"
        data-sky={current?.sky}
        data-moving="false"
      >
        {(['morning', 'day', 'sunset', 'night'] as const).map((sky) => (
          <div
            key={sky}
            className={`sky sky-${sky}`}
            data-active={current?.sky === sky}
          />
        ))}
        <div className="layer clouds" />
        <div className="layer hills" />
        <div className="layer ground" />

        <div className="layer track" aria-hidden="true">
          {STATIONS.map((item, index) => (
            <div
              key={item.id}
              className={`landmark landmark-${item.kind}`}
              style={{ '--station-x': `${stationX(index)}px` } as React.CSSProperties}
            >
              <Landmark kind={item.kind} open={index <= furthest} />
            </div>
          ))}
        </div>

        <div className="rider">
          <Image
            src="/art/rider.webp"
            alt="Illustration of Nadir Hussain riding a kart"
            width={816}
            height={1093}
            priority
            className="rider-image"
          />
          <svg viewBox="0 0 420 190" aria-hidden="true" className="kart">
            <path
              d="M18 50h346c28 0 44 18 44 44v18c0 28-14 40-40 40H52C22 152 8 136 8 110V60c0-6 4-10 10-10z"
              fill="#ffc83d"
              stroke="#16233f"
              strokeWidth="7"
            />
            <text
              x="208"
              y="118"
              textAnchor="middle"
              fontSize="60"
              fontFamily="var(--font-display)"
              fill="#16233f"
            >
              {'</>'}
            </text>
            {[92, 326].map((x) => (
              <g key={x} className="wheel" style={{ transformOrigin: `${x}px 150px` }}>
                <circle cx={x} cy="150" r="36" fill="#16233f" />
                <circle cx={x} cy="150" r="16" fill="#fff8e8" />
                <path
                  d={`M${x - 16} 150h32M${x} 134v32`}
                  stroke="#16233f"
                  strokeWidth="5"
                />
              </g>
            ))}
          </svg>
        </div>

        <header className="hud">
          <p className="hud-item">
            Level {current?.level}/{LEVELS.length}
            <span className="hidden sm:inline">
              : {LEVELS[(current?.level ?? 1) - 1]}
            </span>
          </p>
          <p className="hud-item">
            Projects {collected}/{CHEST_COUNT}
          </p>
          <a href="#resume" className="hud-item hud-skip">
            Skip<span className="hidden sm:inline"> to resume</span>
          </a>
        </header>

        <div
          className="quest-card"
          key={current?.id}
          data-start={current?.kind === 'start'}
        >
          {current?.kind === 'start' ? (
            <>
              <p className="font-extrabold">
                Nadir Hussain, full-stack software engineer
              </p>
              <h1 id="game-title" className="mt-1 font-display text-h1">
                Nadir’s Quest
              </h1>
              <p className="mt-3 text-lead font-bold text-pretty">
                Scroll to drive through my career and open every chest. Arrow keys work
                too.
              </p>
              {resumeHref !== null && (
                <a href={resumeHref} download className="game-button mt-4">
                  Download CV
                </a>
              )}
            </>
          ) : (
            <>
              <h1 id="game-title" className="sr-only">
                Nadir’s Quest
              </h1>
              <p className="font-extrabold text-[#8a4a12]">{current?.label}</p>
              <h2 className="mt-1 font-display text-h3">
                {project?.name ?? current?.title}
              </h2>
              <p className="mt-2 text-pretty">{project?.summary ?? current?.text}</p>
              {project && (
                <button
                  type="button"
                  onClick={() => setOpenProject(project)}
                  className="game-button mt-4"
                >
                  Open project
                </button>
              )}
              {current?.link && (
                <a href={current.link.href} className="game-button mt-4">
                  {current.link.label}
                </a>
              )}
            </>
          )}
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-label={openProject?.name}
        onClose={() => setOpenProject(null)}
        className="game-dialog"
      >
        {openProject && (
          <>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-h3">{openProject.name}</h2>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                aria-label="Close project"
                className="grid size-11 shrink-0 place-items-center"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2">
              <ProjectDetails project={openProject} />
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
