import { PolicySettings } from "../options/PolicySettings";
import { UnlockingSettings } from "../options/UnlockingSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class UnlockingSettingsUi extends SettingsSectionUi<UnlockingSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: UnlockingSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private _itemsExpanded = false;
  private _policiesExpanded = false;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: UnlockingSettings = host.options.auto.unlock) {
    super(host);

    this._options = options;

    const toggleName = "upgrade";

    const itext = ucfirst(this._host.i18n("ui.upgrade"));

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName);

    const label = $("<label/>", {
      text: itext,
    });
    label.on("click", () => this._itemsButton.trigger("click"));

    const input = $("<input/>", {
      id: `toggle-${toggleName}`,
      type: "checkbox",
    });
    this._options.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && this._options.enabled === false) {
        this._host.updateOptions(() => (this._options.enabled = true));
        this._host.imessage("status.auto.enable", [itext]);
      } else if (!input.is(":checked") && this._options.enabled === true) {
        this._host.updateOptions(() => (this._options.enabled = false));
        this._host.imessage("status.auto.disable", [itext]);
      }
    });

    element.append(input, label);

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionHead(toggleName);

    this._itemsButton = this._getItemsToggle(toggleName);
    this._itemsButton.on("click", () => {
      list.toggle();

      this._itemsExpanded = !this._itemsExpanded;

      this._itemsButton.text(this._itemsExpanded ? "-" : "+");
      this._itemsButton.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });

    // Set up the more complex policies options.
    const policiesButton = this.getOption(
      "policies",
      this._options.items.policies,
      this._host.i18n("ui.upgrade.policies"),
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.items.policies.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.policies")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.items.policies.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.policies")]);
        },
      }
    );
    const policiesList = $("<ul/>", {
      id: "items-list-policies",
      css: { display: "none", paddingLeft: "20px" },
    });
    for (const [policyName, policy] of objectEntries(
      (this._options.items.policies as PolicySettings).items
    )) {
      const policyLabel = this._host.i18n(
        `$policy.${policyName === "authocracy" ? "autocracy" : policyName}.label`
      );
      const policyButton = this.getOption(`policy-${policyName}`, policy, policyLabel, false, {
        onCheck: () => {
          this._host.updateOptions(() => (policy.enabled = true));
          this._host.imessage("status.auto.enable", [policyLabel]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (policy.enabled = false));
          this._host.imessage("status.auto.disable", [policyLabel]);
        },
      });

      policiesList.append(policyButton);
    }
    const policiesItemsButton = this._getItemsToggle("policies-show");
    policiesItemsButton.on("click", () => {
      policiesList.toggle();

      this._policiesExpanded = !this._policiesExpanded;

      policiesItemsButton.text(this._policiesExpanded ? "-" : "+");
      policiesItemsButton.prop(
        "title",
        this._policiesExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });
    policiesButton.append(policiesItemsButton, policiesList);

    // Set up the remaining options.
    this._optionButtons = [
      this.getOption(
        "upgrades",
        this._options.items.upgrades,
        this._host.i18n("ui.upgrade.upgrades"),
        false,
        {
          onCheck: () => {
            this._host.updateOptions(() => (this._options.items.upgrades.enabled = true));
            this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.upgrades")]);
          },
          onUnCheck: () => {
            this._host.updateOptions(() => (this._options.items.upgrades.enabled = false));
            this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.upgrades")]);
          },
        }
      ),
      policiesButton,
      this.getOption(
        "techs",
        this._options.items.techs,
        this._host.i18n("ui.upgrade.techs"),
        false,
        {
          onCheck: () => {
            this._host.updateOptions(() => (this._options.items.techs.enabled = true));
            this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.techs")]);
          },
          onUnCheck: () => {
            this._host.updateOptions(() => (this._options.items.techs.enabled = false));
            this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.techs")]);
          },
        }
      ),
      this.getOption(
        "races",
        this._options.items.races,
        this._host.i18n("ui.upgrade.races"),
        false,
        {
          onCheck: () => {
            this._host.updateOptions(() => (this._options.items.races.enabled = true));
            this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.races")]);
          },
          onUnCheck: () => {
            this._host.updateOptions(() => (this._options.items.races.enabled = false));
            this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.races")]);
          },
        }
      ),
      this.getOption(
        "missions",
        this._options.items.missions,
        this._host.i18n("ui.upgrade.missions"),
        false,
        {
          onCheck: () => {
            this._host.updateOptions(() => (this._options.items.missions.enabled = true));
            this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.missions")]);
          },
          onUnCheck: () => {
            this._host.updateOptions(() => (this._options.items.missions.enabled = false));
            this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.missions")]);
          },
        }
      ),
      this.getOption(
        "buildings",
        this._options.items.buildings,
        this._host.i18n("ui.upgrade.buildings"),
        false,
        {
          onCheck: () => {
            this._host.updateOptions(() => (this._options.items.buildings.enabled = true));
            this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.buildings")]);
          },
          onUnCheck: () => {
            this._host.updateOptions(() => (this._options.items.buildings.enabled = false));
            this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.buildings")]);
          },
        }
      ),
    ];

    list.append(...this._optionButtons);

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  setState(state: UnlockingSettings): void {
    this._options.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
    }
    // Handle policies.
    for (const [name, option] of objectEntries(
      (this._options.items.policies as PolicySettings).items
    )) {
      option.enabled = (state.items.policies as PolicySettings).items[name].enabled;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
    }
    // Handle policies
    for (const [name, option] of objectEntries(
      (this._options.items.policies as PolicySettings).items
    )) {
      mustExist(option.$enabled).prop(
        "checked",
        (this._options.items.policies as PolicySettings).items[name].enabled
      );
    }
  }
}
