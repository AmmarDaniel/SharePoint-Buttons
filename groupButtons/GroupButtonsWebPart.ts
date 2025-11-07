// src/webparts/groupButtons/GroupButtonsWebPart.ts
import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
} from "@microsoft/sp-property-pane";

import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType,
  IPropertyFieldCollectionDataProps,
} from "@pnp/spfx-property-controls/lib/PropertyFieldCollectionData";

import GroupButtons, {
  IGroupButtonsProps,
  IButtonConfig,
} from "./components/GroupButtons";

export interface IGroupButtonsWebPartProps {
  buttons: IButtonConfig[];
  columns: number;
  buttonsPerPage: number;
}

export default class GroupButtonsWebPart extends BaseClientSideWebPart<IGroupButtonsWebPartProps> {
  public render(): void {
    // Remove any default host spacing for a snug layout
    this.domElement.style.margin = "0";
    this.domElement.style.padding = "0";

    const element: React.ReactElement<IGroupButtonsProps> = React.createElement(
      GroupButtons,
      {
        buttons: this.properties.buttons || [],
        columns: this.properties.columns ?? 3,
        buttonsPerPage: Math.min(9, this.properties.buttonsPerPage ?? 9), // hard cap at 9
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
    // Define the collection editor for per-button customization.
    const collectionField = PropertyFieldCollectionData("buttons", {
      key: "buttons",
      label: "Buttons",
      panelHeader: "Configure SmartButtons",
      manageBtnLabel: "Manage buttons",
      enableSorting: true,
      fields: [
        {
          id: "title",
          title: "Title",
          type: CustomCollectionFieldType.string,
          required: true,
        },
        {
          id: "url",
          title: "Link (URL)",
          type: CustomCollectionFieldType.string,
        },
        {
          id: "openInNewTab",
          title: "Open in new tab",
          type: CustomCollectionFieldType.boolean,
        },
        {
          id: "icon",
          title: "Icon/emoji",
          type: CustomCollectionFieldType.string,
        },
        {
          id: "iconImage",
          title: "Icon image URL",
          type: CustomCollectionFieldType.string,
        },
        {
          id: "textColor",
          title: "Text color (hex)",
          type: CustomCollectionFieldType.string,
        },
        {
          id: "bgStart",
          title: "Background start (hex)",
          type: CustomCollectionFieldType.string,
        },
        {
          id: "bgEnd",
          title: "Background end (hex)",
          type: CustomCollectionFieldType.string,
        },
        {
          id: "autoHeight",
          title: "Auto height",
          type: CustomCollectionFieldType.boolean,
        },
        {
          id: "textAlign",
          title: "Text alignment",
          type: CustomCollectionFieldType.dropdown,
          options: [
            { key: "left", text: "Left" },
            { key: "center", text: "Center" },
            { key: "right", text: "Right" },
          ],
        },
      ],
      value: this.properties.buttons ?? [],
      onPropertyChange: this.onPropertyPaneFieldChanged,
      enableFiltering: false,
    } as IPropertyFieldCollectionDataProps);

    return {
      pages: [
        {
          header: { description: "Group of SmartButtons" },
          groups: [
            {
              groupName: "Buttons",
              groupFields: [collectionField],
            },
            {
              groupName: "Layout",
              groupFields: [
                PropertyPaneSlider("columns", {
                  label: "Grid columns",
                  min: 1,
                  max: 4,
                  step: 1,
                }),
                PropertyPaneSlider("buttonsPerPage", {
                  label: "Buttons per page (max 9)",
                  min: 1,
                  max: 9,
                  step: 1,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
