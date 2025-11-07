import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneLabel,
  PropertyPaneSlider,
} from "@microsoft/sp-property-pane";
import { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import BigButton, { IBigButtonProps } from "./components/BigButton";

import {
  PropertyFieldColorPicker,
  PropertyFieldColorPickerStyle,
  IPropertyFieldColorPickerProps,
} from "@pnp/spfx-property-controls/lib/PropertyFieldColorPicker";

export interface IBigButtonWebPartProps extends IBigButtonProps {
  /** Free-text override (e.g., "50%", "18px", "1.25rem"). When present & valid, it wins. */
  borderRadiusOverride?: string;
}

export default class BigButtonWebPart extends BaseClientSideWebPart<IBigButtonWebPartProps> {
  public render(): void {
    const align = this.properties.horizontalAlign ?? "left";
    const offset = this.properties.horizontalOffset ?? 0;

    const host: HTMLElement = this.domElement;
    const parent = host.parentElement;

    if (align === "left" && offset === 0) {
      this._shrinkToContent(this.domElement);
      host.style.display = "inline-block";
      host.style.padding = "0";
      host.style.margin = "0";
      host.style.width = "fit-content";
      host.style.height = "fit-content";
      host.style.overflow = "visible";
      if (parent) {
        parent.style.display = "inline-block";
        parent.style.paddingRight = "0";
        parent.style.marginRight = "0";
        parent.style.width = "fit-content";
        parent.style.height = "fit-content";
        parent.style.textAlign = "left";
      }
    } else {
      // Layout mode: full-width wrapper
      host.style.display = "block";
      host.style.padding = "0";
      host.style.margin = "0";
      host.style.width = "100%";
      host.style.height = "auto";
      host.style.overflow = "visible";
      if (parent) {
        parent.style.textAlign = "initial";
        parent.style.width = "100%";
        parent.style.display = "block";
      }
    }

    // Compute final border radius string (override wins if valid)
    const borderRadius = this._computeRadius(
      this.properties.borderRadiusOverride,
      this.properties.borderRadius
    );

    const element: React.ReactElement<IBigButtonProps> = React.createElement(
      BigButton,
      {
        // Content
        logoUrl: this.properties.logoUrl,
        textBottom: this.properties.textBottom ?? "Duolingo",

        // Sizing + typography
        buttonSize: this.properties.buttonSize ?? 130,
        labelFontSize: this.properties.labelFontSize ?? 16,

        // Colors
        buttonBgColor: this.properties.buttonBgColor ?? "#057702",
        overlayColor: this.properties.overlayColor ?? "#316b58",
        logoBgColor: this.properties.logoBgColor ?? "#0f1715",
        textBottomColor: this.properties.textBottomColor ?? "#d6cbbf",

        // Border radius (string: "12px" | "50%" | "1rem" ...)
        borderRadius: borderRadius ?? "12px",

        // Navigation
        linkUrl: this.properties.linkUrl,

        // Accessibility
        ariaLabel: this.properties.ariaLabel ?? "Big button",

        // Layout
        horizontalAlign: this.properties.horizontalAlign ?? "left",
        horizontalOffset: this.properties.horizontalOffset ?? 0,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  //Quick URL validation for the link field
  private _validateUrl = (value: string): string => {
    if (!value) return "";
    const ok = /^https?:\/\/.+/i.test(value.trim());
    return ok ? "" : "Enter a valid http(s) URL";
  };

  //Color picker helper (PnP Property Controls)
  private _color = (
    key: keyof IBigButtonWebPartProps,
    label: string
  ): IPropertyPaneField<IPropertyFieldColorPickerProps> =>
    PropertyFieldColorPicker(key as string, {
      label,
      selectedColor: (this.properties[key] as string) ?? "",
      onPropertyChange: this.onPropertyPaneFieldChanged,
      properties: this.properties,
      alphaSliderHidden: false,
      style: PropertyFieldColorPickerStyle.Full,
      key: `${String(key)}-picker`,
    });

  /*
    Accepts a free-text override (e.g., "50%", "18px", "1rem") and validates it.
    If valid, returns it; otherwise falls back to the slider value.
    Slider may be stored as number (legacy) or "12px" string (new).
   */
  private _computeRadius(override?: string, slider?: string | number): string {
    const ov = (override ?? "").trim();
    if (ov && this._isValidCssLengthOrPercent(ov)) {
      return ov; // ex: "50%" or "18px" or "1.25rem"
    }

    // Normalize slider into px string
    if (typeof slider === "string") {
      const s = slider.trim();
      // Already px string?
      if (/^\d+(\.\d+)?px$/.test(s)) return s;
      // Numeric string: convert to px
      const n = Number(s);
      if (Number.isFinite(n)) return `${n}px`;
      return "12px";
    } else if (typeof slider === "number" && Number.isFinite(slider)) {
      return `${slider}px`;
    }

    return "12px";
  }

  /*
    Validate % or CSS lengths (px, em, rem, vh, vw).
    Extend units here as needed.
   */
  private _isValidCssLengthOrPercent(value: string): boolean {
    return /^-?\d+(\.\d+)?\s*(px|em|rem|vh|vw|%)$/.test(value);
  }

  //Make host and a few ancestors hug content.
  private _shrinkToContent(host: HTMLElement): void {
    const tweak = (el: HTMLElement): void => {
      el.style.display = "inline-block";
      el.style.boxSizing = "content-box";
      el.style.width = "max-content";
      el.style.height = "max-content";
      el.style.minWidth = "0";
      el.style.minHeight = "0";
      el.style.paddingRight = "0";
      el.style.marginRight = "0";
      el.style.flex = "0 0 auto";
      const s = el.style as CSSStyleDeclaration & {
        alignSelf?: string;
        justifySelf?: string;
      };
      s.alignSelf = "flex-start";
      s.justifySelf = "start";
    };

    // Host itself
    tweak(host);

    // Also tighten 2–3 ancestors (covers common SharePoint wrappers)
    let el: HTMLElement | null = host.parentElement;
    for (let i = 0; i < 3 && el; i++) {
      tweak(el);
      el = el.parentElement;
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // Page 1 — Content
        {
          header: { description: "Configure the Big Button" },
          groups: [
            {
              groupName: "Content",
              groupFields: [
                PropertyPaneTextField("textBottom", {
                  label: "Bottom text",
                  placeholder: "e.g., Duolingo",
                }),
                PropertyPaneTextField("ariaLabel", {
                  label: "Accessible label (screen readers)",
                }),
                PropertyPaneLabel("", { text: " " }),
                PropertyPaneTextField("logoUrl", {
                  label: "Logo Image URL",
                  placeholder: "Paste a full URL (e.g., from Site Assets)",
                }),
              ],
            },
          ],
        },

        // Page 2 — Navigation
        {
          header: { description: "Navigation" },
          groups: [
            {
              groupName: "Link",
              groupFields: [
                PropertyPaneTextField("linkUrl", {
                  label: "Link URL (opens in same tab)",
                  placeholder: "https://contoso.com/path",
                  onGetErrorMessage: this._validateUrl,
                  deferredValidationTime: 300,
                }),
              ],
            },
          ],
        },

        // Page 3 — Colors
        {
          header: { description: "Colors" },
          groups: [
            {
              groupName: "Palette",
              groupFields: [
                this._color("buttonBgColor", "Button background"),
                this._color("overlayColor", "Ripple/overlay"),
                this._color("logoBgColor", "Logo circle background"),
                this._color("textBottomColor", "Bottom text"),
              ],
            },
          ],
        },

        // Page 4 — Layout & Sizing
        {
          header: { description: "Layout" },
          groups: [
            {
              groupName: "Positioning & Sizing",
              groupFields: [
                PropertyPaneSlider("buttonSize", {
                  label: "Button size (px)",
                  min: 96,
                  max: 220,
                  step: 2,
                  showValue: true,
                }),
                PropertyPaneSlider("labelFontSize", {
                  label: "Label font size (px)",
                  min: 12,
                  max: 28,
                  step: 1,
                  showValue: true,
                }),
                PropertyPaneSlider("borderRadius", {
                  label: "Button border radius (px)",
                  min: 0,
                  max: 32,
                  step: 1,
                  showValue: true,
                }),
                // Free-text override for % or any CSS length
                PropertyPaneTextField("borderRadiusOverride", {
                  label: "Custom border radius (e.g., 50%, 18px, 1.25rem)",
                  placeholder: "50%",
                  onGetErrorMessage: (val: string) => {
                    if (!val || !val.trim()) return "";
                    return this._isValidCssLengthOrPercent(val.trim())
                      ? ""
                      : "Enter a valid value like 50%, 12px, 1.2rem";
                  },
                  deferredValidationTime: 300,
                }),
                PropertyPaneSlider("horizontalOffset", {
                  label: "Horizontal offset (px)",
                  min: -200,
                  max: 200,
                  step: 1,
                  showValue: true,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
