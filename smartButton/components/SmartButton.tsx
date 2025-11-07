import * as React from "react";
import styles from "./SmartButton.module.scss";

export type TextAlignOption = "left" | "center" | "right";

export interface ISmartButtonProps {
  title: string;
  url: string;
  openInNewTab: boolean;
  textColor: string;
  bgStart: string;
  bgEnd?: string;

  autoHeight: boolean;
  height: number; // px when autoHeight=false
  paddingY: number; // px

  borderRadius: number;
  fontSize: number;
  icon?: string;
  iconImage?: string; // url to an image file for the icon
  paddingX: number;

  textAlign: TextAlignOption;
}

const SmartButton: React.FC<ISmartButtonProps> = (props) => {
  const {
    title,
    url,
    openInNewTab,
    textColor,
    bgStart,
    bgEnd,
    autoHeight,
    height,
    paddingY,
    borderRadius,
    fontSize,
    icon,
    iconImage,
    paddingX,
    textAlign,
  } = props;

  const bg =
    bgEnd && bgEnd.trim() && bgEnd.toLowerCase() !== bgStart.toLowerCase()
      ? `linear-gradient(135deg, ${bgStart}, ${bgEnd})`
      : bgStart;

  const target = openInNewTab ? "_blank" : "_self";

  // Map alignment to flex justification for the content row
  const justify =
    textAlign === "center"
      ? "center"
      : textAlign === "right"
      ? "flex-end"
      : "flex-start";

  const fixedHeight = Math.max(1, Number(height || 0));

  return (
    <div
      className={styles.root}
      style={{
        width: "100%",
        height: autoHeight ? "auto" : `${fixedHeight}px`,
        margin: 0,
        padding: 0,
      }}
    >
      <a
        className={styles.button}
        href={url || "#"}
        target={target}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        aria-label={title}
        title={title}
        style={{
          background: bg,
          color: textColor,
          borderRadius: `${borderRadius}px`,
          fontSize: `${fontSize}px`,
          paddingLeft: `${paddingX}px`,
          paddingRight: `${paddingX}px`,
          paddingTop: `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
          height: autoHeight ? "auto" : "100%",
        }}
      >
        <span className={styles.content} style={{ justifyContent: justify }}>
          {icon && (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          )}
          {iconImage && (
            <img
              src={iconImage}
              alt=""
              className={(styles as Record<string, string>).iconImage}
              aria-hidden="true"
            />
          )}
          <span className={styles.text}>{title}</span>
        </span>
      </a>
    </div>
  );
};

export default SmartButton;
