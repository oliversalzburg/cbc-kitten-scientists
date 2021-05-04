import { AllBuildableItems, Jobs, Race, Resource, Season } from "../types";
import { FaithItem, UnicornItem } from "./ReligionSettings";
import { SpaceItem } from "./SpaceSettings";
import { TimeItem } from "./TimeSettings";

type SetMaxBuildingItem = `set-${AllBuildableItems}-max`;
type SetMaxJobItem = `set-${Jobs}-max`;
type SetMaxResourceItem = `set-${Resource}-max`;
type SetMinResetBuildingItem = `set-reset-build-${AllBuildableItems}-min`;
type SetMinResetFaithItem = `set-reset-faith-${FaithItem}-min`;
type SetMinResetSpaceItem = `set-reset-space-${SpaceItem}-min`;
type SetMinResetTimeItem = `set-reset-time-${TimeItem}-min`;
type SetMinResetUnicornItem = `set-reset-unicorn-${UnicornItem}-min`;
type ToggleBuildingItem = `toggle-${AllBuildableItems}`;
type ToggleFaithUnicornItem = `toggle-${FaithItem | UnicornItem}`;
type ToggleJobItem = `toggle-${Jobs}`;
type ToggleRaceItem = `toggle-${Race}`;
type ToggleRaceSeasonItem = `toggle-${Race}-${Season}`;
type ToggleResetBuildingItem = `toggle-reset-build-${AllBuildableItems}`;
type ToggleResetFaithItem = `toggle-reset-faith-${FaithItem}`;
type ToggleResetSpaceItem = `toggle-reset-space-${SpaceItem}`;
type ToggleResetTimeItem = `toggle-reset-time-${TimeItem}`;
type ToggleResetUnicornItem = `toggle-reset-unicorn-${UnicornItem}`;
type ToggleResourceItem = `toggle-${Resource}`;
type ToggleTimeItem = `toggle-${TimeItem}`;
type ToggleLimitedJobItem = `toggle-limited-${Jobs}`;
type ToggleLimitedRaceItem = `toggle-limited-${Race}`;
type ToggleLimitedResourceItem = `toggle-limited-${Resource}`;

/**
 * The type of the 1.5.0 settings object.
 */
export type KittenStorageType = {
  version: number;
  toggles: Record<string, boolean>;
  items: Partial<Record<SetMaxBuildingItem, number>> &
    Partial<Record<SetMaxJobItem, number>> &
    Partial<Record<SetMaxResourceItem, number>> &
    Partial<Record<SetMinResetBuildingItem, number>> &
    Partial<Record<SetMinResetFaithItem, number>> &
    Partial<Record<SetMinResetSpaceItem, number>> &
    Partial<Record<SetMinResetTimeItem, number>> &
    Partial<Record<SetMinResetUnicornItem, number>> &
    Partial<Record<ToggleBuildingItem, boolean>> &
    Partial<Record<ToggleFaithUnicornItem, boolean>> &
    Partial<Record<ToggleJobItem, boolean>> &
    Partial<Record<ToggleLimitedJobItem, boolean>> &
    Partial<Record<ToggleLimitedRaceItem, boolean>> &
    Partial<Record<ToggleLimitedResourceItem, boolean>> &
    Partial<Record<ToggleRaceItem, boolean>> &
    Partial<Record<ToggleRaceSeasonItem, boolean>> &
    Partial<Record<ToggleResetBuildingItem, boolean>> &
    Partial<Record<ToggleResetFaithItem, boolean>> &
    Partial<Record<ToggleResetSpaceItem, boolean>> &
    Partial<Record<ToggleResetTimeItem, boolean>> &
    Partial<Record<ToggleResetUnicornItem, boolean>> &
    Partial<Record<ToggleResourceItem, boolean>> &
    Partial<Record<ToggleTimeItem, boolean>>;
  resources: Partial<
    Record<
      Resource,
      {
        /**
         * This indicates if the resource option relates to the timeControl.reset automation.
         * If it's `false`, it's a resource option in the craft settings.
         */
        checkForReset: boolean;
        consume?: number;
        enabled: boolean;
        stock: number;
        stockForReset: number;
      }
    >
  >;
  triggers: {
    build: number;
    craft: number;
    faith: number;
    space: number;
    time: number;
    trade: number;
  };
  reset: {
    reset: boolean;
    times: number;
    paragonLastTime: number;
    pargonTotal: number;
    karmaLastTime: number;
    karmaTotal: number;
  };
};

export class SettingsStorage {
  static getLegacySettings(): KittenStorageType | null {
    const saved = JSON.parse(localStorage["cbc.kitten-scientists"] || "null");
    return saved === null ? null : (saved as KittenStorageType);
  }
  static setLegacySettings(settings: KittenStorageType): void {
    localStorage["cbc.kitten-scientists"] = JSON.stringify(settings);
  }
}
