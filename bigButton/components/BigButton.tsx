import * as React from "react";
import styles from "./BigButton.module.scss";

export interface IBigButtonProps {
  logoUrl?: string;

  /** bottom text now shown OUTSIDE the button */
  textBottom?: string;
  labelFontSize?: number;

  /** palette */
  buttonBgColor?: string;
  overlayColor?: string;
  logoBgColor?: string;
  textBottomColor?: string;

  /** click navigation (optional) */
  linkUrl?: string;

  /** accessibility */
  ariaLabel?: string;

  /** layout */
  buttonSize?: number;
  horizontalAlign?: "left" | "center" | "right";
  horizontalOffset?: number; // px
  borderRadius?: string;
}

const BigButton: React.FC<IBigButtonProps> = ({
  logoUrl,
  textBottom = "Duolingo",
  labelFontSize = 16,
  buttonSize = 130,
  buttonBgColor = "#057702",
  overlayColor = "#316b58",
  logoBgColor = "#0f1715",
  textBottomColor = "#d6cbbf",
  linkUrl,
  ariaLabel,
  horizontalAlign = "left",
  horizontalOffset = 0,
  borderRadius = "12px",
}) => {
  const cssVars: React.CSSProperties & Record<string, string> = {
    "--btn-size": `${buttonSize}px`,
    "--btn-bg": buttonBgColor,
    "--overlay": overlayColor,
    "--logo-bg": logoBgColor,
    "--text-bottom": textBottomColor,
    "--label-font-size": `${labelFontSize}px`,
    "--btn-radius": borderRadius,
  };

  const computedAria = ariaLabel ?? textBottom ?? "Big button";

  const cssStyles = styles as unknown as Record<string, string>;
  const alignClass =
    horizontalAlign === "center"
      ? cssStyles.outerWrapCenter
      : horizontalAlign === "right"
      ? cssStyles.outerWrapRight
      : cssStyles.outerWrapLeft;

  // typed CSS custom property object for inline style
  const nudgeStyle: React.CSSProperties & Record<string, string> = {
    "--nudge-x": `${horizontalOffset}px`,
  };

  const buttonInner = (
    <div className={styles.logoWrap} aria-hidden="true">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className={styles.logoImg}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
      ) : (
        <div className={styles.logoFallback} />
      )}
    </div>
  );

  const clickable = linkUrl ? (
    <a
      href={linkUrl}
      className={`${styles.bigButton} ${styles.buttonRoot}`}
      aria-label={computedAria}
    >
      {buttonInner}
    </a>
  ) : (
    <button
      type="button"
      className={`${styles.bigButton} ${styles.buttonRoot}`}
      aria-label={computedAria}
    >
      {buttonInner}
    </button>
  );

  return (
    <div className={`${styles.outerWrap} ${alignClass}`}>
      <div className={styles.nudge} style={{ ...nudgeStyle, ...cssVars }}>
        {clickable}
        <div className={styles.belowText}>{textBottom}</div>
      </div>
    </div>
  );
};

export default BigButton;
