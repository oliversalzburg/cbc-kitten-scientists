import { BulkManager } from "./BulkManager";
import { CraftManager } from "./CraftManager";
import { SpaceItem } from "./options/SpaceSettings";
import { TabManager } from "./TabManager";
import { BuildButton, SpaceBuildingInfo, SpaceTab } from "./types";
import { UserScript } from "./UserScript";

export class SpaceManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<SpaceTab>;
  private readonly _crafts: CraftManager;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Space");
    this._crafts = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
  }

  build(name: SpaceItem, amount: number): void {
    const build = this.getBuild(name);
    const button = this.getBuildButton(name);

    if (
      !build.unlocked ||
      !button ||
      !button.model.enabled ||
      !this._host.options.auto.space.items[name].enabled
    ) {
      return;
    }

    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      this._host.warning(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }
    this._host.storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.iactivity("act.builds", [label, amount], "ks-build");
    }
  }

  getBuild(name: SpaceItem): SpaceBuildingInfo {
    return this._host.gamePage.space.getBuilding(name);
  }

  getBuildButton(name: string): BuildButton | null {
    const panels = this.manager.tab.planetPanels;

    for (const panel in panels) {
      for (const child in panels[panel].children) {
        if (panels[panel].children[child].id === name) return panels[panel].children[child];
      }
    }

    return null;
  }
}
