import { IButtonConfig } from "./GroupButtons";

export interface IGroupButtonsProps {
  buttons: IButtonConfig[];
  columns: number;
  buttonsPerPage: number;
}
