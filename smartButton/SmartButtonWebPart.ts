import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneChoiceGroup,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import SmartButton, { ISmartButtonProps } from "./components/SmartButton";

import {
  PropertyFieldColorPicker,
  PropertyFieldColorPickerStyle,
} from "@pnp/spfx-property-controls/lib/PropertyFieldColorPicker";

export type TextAlignOption = "left" | "center" | "right";

export interface ISmartButtonWebPartProps {
  title: string;
  url: string;
  openInNewTab: boolean;
  textColor: string;
  bgStart: string;
  bgEnd: string;
  autoHeight: boolean;
  height: number; // px, used when autoHeight=false
  paddingY: number; // px
  borderRadius: number; // px
  fontSize: number; // px
  icon?: string; // emoji or short text
  iconImage?: string; // URL to an image to use as icon
  paddingX: number; // px
  textAlign: TextAlignOption;
}

export default class SmartButtonWebPart extends BaseClientSideWebPart<ISmartButtonWebPartProps> {
  public render(): void {
    // Remove any default host spacing
    this.domElement.style.margin = "0";
    this.domElement.style.padding = "0";

    // Only force a fixed web part height if autoHeight is OFF.
    if (this.properties.autoHeight) {
      this.domElement.style.removeProperty("height");
    } else {
      const h = Math.max(1, Number(this.properties.height || 0));
      this.domElement.style.height = `${h}px`;
    }

    const element: React.ReactElement<ISmartButtonProps> = React.createElement(
      SmartButton,
      {
        title: this.properties.title,
        url: this.properties.url,
        openInNewTab: this.properties.openInNewTab,
        textColor: this.properties.textColor,
        bgStart: this.properties.bgStart,
        bgEnd: this.properties.bgEnd,
        autoHeight: this.properties.autoHeight,
        height: this.properties.height,
        paddingY: this.properties.paddingY,
        borderRadius: this.properties.borderRadius,
        fontSize: this.properties.fontSize,
        icon: this.properties.icon,
        iconImage: this.properties.iconImage,
        paddingX: this.properties.paddingX,
        textAlign: this.properties.textAlign,
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Configure your button" },
          groups: [
            {
              groupName: "Content",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Button text",
                  placeholder: "e.g., Budget Change",
                }),
                PropertyPaneTextField("url", {
                  label: "Link (URL)",
                  placeholder: "https://contoso.sharepoint.com/...",
                }),
                PropertyPaneToggle("openInNewTab", {
                  label: "Open in new tab",
                  onText: "Yes",
                  offText: "No",
                }),
                PropertyPaneTextField("icon", {
                  label: "Prefix icon/emoji (optional)",
                  placeholder: "e.g., ✏️ or 🔒",
                }),
                PropertyPaneTextField("iconImage", {
                  label: "Icon image URL (optional)",
                  placeholder:
                    "https://tenant.sharepoint.com/sites/.../image.png",
                }),
                PropertyPaneChoiceGroup("textAlign", {
                  label: "Text alignment",
                  options: [
                    { key: "left", text: "Left" },
                    { key: "center", text: "Center" },
                    { key: "right", text: "Right" },
                  ],
                }),
              ],
            },
            {
              groupName: "Appearance",
              groupFields: [
                PropertyPaneToggle("autoHeight", {
                  label: "Auto height (fit content)",
                  onText: "Auto",
                  offText: "Fixed",
                }),
                PropertyPaneSlider("height", {
                  label: "Fixed height (px)",
                  min: 1,
                  max: 1000,
                  step: 1,
                }),
                PropertyPaneSlider("paddingY", {
                  label: "Vertical padding (px)",
                  min: 0,
                  max: 64,
                  step: 1,
                }),
                PropertyPaneSlider("fontSize", {
                  label: "Text size (px)",
                  min: 10,
                  max: 48,
                  step: 1,
                }),
                PropertyPaneSlider("borderRadius", {
                  label: "Border radius (px)",
                  min: 0,
                  max: 32,
                  step: 1,
                }),
                PropertyPaneSlider("paddingX", {
                  label: "Horizontal padding (px)",
                  min: 0,
                  max: 48,
                  step: 1,
                }),
                PropertyFieldColorPicker("bgStart", {
                  label: "Background color (start / solid)",
                  selectedColor: this.properties.bgStart,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  key: "bgStart",
                  debounce: 200,
                  style: PropertyFieldColorPickerStyle.Inline,
                  alphaSliderHidden: false,
                }),
                PropertyFieldColorPicker("bgEnd", {
                  label: "Background color (end for gradient, optional)",
                  selectedColor: this.properties.bgEnd,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  key: "bgEnd",
                  debounce: 200,
                  style: PropertyFieldColorPickerStyle.Inline,
                  alphaSliderHidden: false,
                }),
                PropertyFieldColorPicker("textColor", {
                  label: "Text color",
                  selectedColor: this.properties.textColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  key: "textColor",
                  debounce: 200,
                  style: PropertyFieldColorPickerStyle.Inline,
                  alphaSliderHidden: false,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
