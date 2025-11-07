import * as React from "react";
import styles from "./GroupButtons.module.scss";
import SmartButton, {
  ISmartButtonProps,
} from "../../smartButton/components/SmartButton";
import { IGroupButtonsProps } from "./IGroupButtonsProps";

export type TextAlignOption = "left" | "center" | "right";

export interface IButtonConfig {
  title: string;
  url: string;
  openInNewTab: boolean;
  textColor: string;
  bgStart: string;
  bgEnd?: string;
  autoHeight: boolean;
  height: number;
  paddingY: number;
  borderRadius: number;
  fontSize: number;
  icon?: string;
  iconImage?: string;
  paddingX: number;
  textAlign: TextAlignOption;
}

// Clamp helpers
const clampColumns = (n: number): number =>
  Math.max(1, Math.min(4, Math.floor(n || 3)));
const clampPerPage = (n: number): number =>
  Math.max(1, Math.min(9, Math.floor(n || 9)));

const GroupButtons: React.FC<IGroupButtonsProps> = ({
  buttons,
  columns,
  buttonsPerPage,
}) => {
  const [page, setPage] = React.useState(0);
  const [animClass, setAnimClass] = React.useState<string>("");

  const perPage = clampPerPage(buttonsPerPage);
  const total = Array.isArray(buttons) ? buttons.length : 0;
  const pages = Math.max(1, Math.ceil(total / perPage));

  // Keep page in range if data/props change
  React.useEffect(() => {
    setPage((p) => Math.min(p, pages - 1));
  }, [total, perPage, pages]);

  const startIdx = page * perPage;
  const visible = (buttons || []).slice(startIdx, startIdx + perPage);

  const gridCols = clampColumns(columns);

  // Fixed pager position: compute the maximum rows per page and a stable min-height
  const maxRows = Math.ceil(perPage / gridCols);
  const baseRowMinPx = 64; // matches grid-auto-rows: minmax(64px, auto);
  const gapPx = 12; // matches .grid gap
  const minHeightPx = maxRows * baseRowMinPx + (maxRows - 1) * gapPx;

  // Page navigation with slide animations
  const goPrev = (): void => {
    setAnimClass(styles.animRight);
    setPage((p) => Math.max(0, p - 1));
  };

  const goNext = (): void => {
    setAnimClass(styles.animLeft);
    setPage((p) => Math.min(pages - 1, p + 1));
  };

  // Clear animation class after it runs to avoid stacking classes
  React.useEffect(() => {
    const t = setTimeout(() => setAnimClass(""), 350);
    return () => clearTimeout(t);
  }, [page]);

  return (
    <div className={styles.root}>
      {/* Grid wrapper with stable min-height to keep pager from moving */}
      <div
        className={styles.gridWrap}
        style={{ minHeight: `${minHeightPx}px` }}
      >
        <div
          className={`${styles.grid} ${animClass}`}
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
        >
          {visible.map((b, i) => {
            const props: ISmartButtonProps = {
              title: b.title,
              url: b.url,
              openInNewTab: !!b.openInNewTab,
              textColor: b.textColor || "#ffffff",
              bgStart: b.bgStart || "#1f6f5c",
              bgEnd: b.bgEnd,
              autoHeight: !!b.autoHeight,
              height: Number.isFinite(b.height) ? b.height : 64,
              paddingY: Number.isFinite(b.paddingY) ? b.paddingY : 12,
              borderRadius: Number.isFinite(b.borderRadius)
                ? b.borderRadius
                : 12,
              fontSize: Number.isFinite(b.fontSize) ? b.fontSize : 16,
              icon: b.icon,
              iconImage: b.iconImage,
              paddingX: Number.isFinite(b.paddingX) ? b.paddingX : 16,
              textAlign: b.textAlign || "left",
            };

            return (
              <div key={`${startIdx + i}-${b.title}`} className={styles.cell}>
                <SmartButton {...props} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Pager */}

      {pages > 1 && (
        <div
          className={styles.pager}
          role="navigation"
          aria-label="Buttons pagination"
        >
          <button
            type="button"
            className={`${styles.pagerBtn} ${styles.pagerEdge}`}
            onClick={goPrev}
            disabled={page === 0}
            aria-label="Previous"
          >
            {/* Chevron icon via text for simplicity */}‹
          </button>

          {/* Center area: current page, total, and optional dots */}
          <div className={styles.pagerCenter}>
            {/*<span className={styles.pageInfo} aria-live="polite">
              Page {page + 1} of {pages}
            </span>*/}

            {/* Dots: small indicators for each page */}
            <div className={styles.pageDots} aria-hidden="true">
              {Array.from({ length: pages }).map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  className={`${styles.dot} ${
                    idx === page ? styles.dotActive : ""
                  }`}
                  onClick={() => {
                    // animate direction based on target page
                    setAnimClass(
                      idx > page ? styles.animLeft : styles.animRight
                    );
                    setPage(idx);
                  }}
                  tabIndex={-1} // keep tabbable order simple; main buttons carry focus
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`${styles.pagerBtn} ${styles.pagerEdge}`}
            onClick={goNext}
            disabled={page >= pages - 1}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupButtons;
export type { IGroupButtonsProps };
