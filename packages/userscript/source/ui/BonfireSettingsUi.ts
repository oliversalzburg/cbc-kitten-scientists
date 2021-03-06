import { BonfireSettings, BonfireSettingsItem } from "../options/BonfireSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class BonfireSettingsUi extends SettingsSectionUi<BonfireSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: BonfireSettings;

  private _itemsExpanded = false;

  constructor(host: UserScript, options: BonfireSettings = host.options.auto.build) {
    super(host);

    this._options = options;

    const toggleName = "build";

    const itext = ucfirst(this._host.i18n("ui.build"));

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, itext);

    this._options.$enabled = element.checkbox;

    element.checkbox.on("change", () => {
      if (element.checkbox.is(":checked") && this._options.enabled === false) {
        this._host.updateOptions(() => (this._options.enabled = true));
        this._host.imessage("status.auto.enable", [itext]);
      } else if (!element.checkbox.is(":checked") && this._options.enabled === true) {
        this._host.updateOptions(() => (this._options.enabled = false));
        this._host.imessage("status.auto.disable", [itext]);
      }
    });

    // Create "trigger" button in the item.
    const triggerButton = $("<div/>", {
      id: `trigger-${toggleName}`,
      text: this._host.i18n("ui.trigger"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });
    this._options.$trigger = triggerButton;

    triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger.toString()
      );

      if (value !== null) {
        this._host.updateOptions(() => (this._options.trigger = parseFloat(value)));
        triggerButton[0].title = this._options.trigger.toFixed(2);
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    element.items.on("click", () => {
      list.toggle();

      this._itemsExpanded = !this._itemsExpanded;

      element.items.text(this._itemsExpanded ? "-" : "+");
      element.items.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });

    const optionButtons = [
      this._getHeader(this._host.i18n("$buildings.group.food")),
      this._getLimitedOption(
        "field",
        this._options.items.field,
        this._host.i18n("$buildings.field.label")
      ),
      this._getLimitedOption(
        "pasture",
        this._options.items.pasture,
        this._host.i18n("$buildings.pasture.label")
      ),
      this._getLimitedOption(
        "solarFarm",
        this._options.items.solarFarm,
        `⮤ ${this._host.i18n("$buildings.solarfarm.label")}`
      ),
      this._getLimitedOption(
        "aqueduct",
        this._options.items.aqueduct,
        this._host.i18n("$buildings.aqueduct.label")
      ),
      this._getLimitedOption(
        "hydroPlant",
        this._options.items.hydroPlant,
        `⮤ ${this._host.i18n("$buildings.hydroplant.label")}`,
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.population")),
      this._getLimitedOption(
        "hut",
        this._options.items.hut,
        this._host.i18n("$buildings.hut.label")
      ),
      this._getLimitedOption(
        "logHouse",
        this._options.items.logHouse,
        this._host.i18n("$buildings.logHouse.label")
      ),
      this._getLimitedOption(
        "mansion",
        this._options.items.mansion,
        this._host.i18n("$buildings.mansion.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.science")),
      this._getLimitedOption(
        "library",
        this._options.items.library,
        this._host.i18n("$buildings.library.label")
      ),
      this._getLimitedOption(
        "dataCenter",
        this._options.items.dataCenter,
        `⮤ ${this._host.i18n("$buildings.dataCenter.label")}`
      ),
      this._getLimitedOption(
        "academy",
        this._options.items.academy,
        this._host.i18n("$buildings.academy.label")
      ),
      this._getLimitedOption(
        "observatory",
        this._options.items.observatory,
        `⮤ ${this._host.i18n("$buildings.observatory.label")}`
      ),
      this._getLimitedOption(
        "biolab",
        this._options.items.biolab,
        this._host.i18n("$buildings.biolab.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.storage")),
      this._getLimitedOption(
        "barn",
        this._options.items.barn,
        this._host.i18n("$buildings.barn.label")
      ),
      this._getLimitedOption(
        "harbor",
        this._options.items.harbor,
        this._host.i18n("$buildings.harbor.label")
      ),
      this._getLimitedOption(
        "warehouse",
        this._options.items.warehouse,
        this._host.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.resource")),
      this._getLimitedOption(
        "mine",
        this._options.items.mine,
        this._host.i18n("$buildings.mine.label")
      ),
      this._getLimitedOption(
        "quarry",
        this._options.items.quarry,
        this._host.i18n("$buildings.quarry.label")
      ),
      this._getLimitedOption(
        "lumberMill",
        this._options.items.lumberMill,
        this._host.i18n("$buildings.lumberMill.label")
      ),
      this._getLimitedOption(
        "oilWell",
        this._options.items.oilWell,
        this._host.i18n("$buildings.oilWell.label")
      ),
      this._getLimitedOption(
        "accelerator",
        this._options.items.accelerator,
        this._host.i18n("$buildings.accelerator.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.industry")),
      this._getLimitedOption(
        "steamworks",
        this._options.items.steamworks,
        this._host.i18n("$buildings.steamworks.label")
      ),
      this._getLimitedOption(
        "magneto",
        this._options.items.magneto,
        this._host.i18n("$buildings.magneto.label")
      ),
      this._getLimitedOption(
        "smelter",
        this._options.items.smelter,
        this._host.i18n("$buildings.smelter.label")
      ),
      this._getLimitedOption(
        "calciner",
        this._options.items.calciner,
        this._host.i18n("$buildings.calciner.label")
      ),
      this._getLimitedOption(
        "factory",
        this._options.items.factory,
        this._host.i18n("$buildings.factory.label")
      ),
      this._getLimitedOption(
        "reactor",
        this._options.items.reactor,
        this._host.i18n("$buildings.reactor.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.culture")),
      this._getLimitedOption(
        "amphitheatre",
        this._options.items.amphitheatre,
        this._host.i18n("$buildings.amphitheatre.label")
      ),
      this._getLimitedOption(
        "broadcastTower",
        this._options.items.broadcastTower,
        `⮤ ${this._host.i18n("$buildings.broadcasttower.label")}`
      ),
      this._getLimitedOption(
        "chapel",
        this._options.items.chapel,
        this._host.i18n("$buildings.chapel.label")
      ),
      this._getLimitedOption(
        "temple",
        this._options.items.temple,
        this._host.i18n("$buildings.temple.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.other")),
      this._getLimitedOption(
        "workshop",
        this._options.items.workshop,
        this._host.i18n("$buildings.workshop.label")
      ),
      this._getLimitedOption(
        "tradepost",
        this._options.items.tradepost,
        this._host.i18n("$buildings.tradepost.label")
      ),
      this._getLimitedOption(
        "mint",
        this._options.items.mint,
        this._host.i18n("$buildings.mint.label")
      ),
      this._getLimitedOption(
        "brewery",
        this._options.items.brewery,
        this._host.i18n("$buildings.brewery.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.megastructures")),
      this._getLimitedOption(
        "ziggurat",
        this._options.items.ziggurat,
        this._host.i18n("$buildings.ziggurat.label")
      ),
      this._getLimitedOption(
        "chronosphere",
        this._options.items.chronosphere,
        this._host.i18n("$buildings.chronosphere.label")
      ),
      this._getLimitedOption(
        "aiCore",
        this._options.items.aiCore,
        this._host.i18n("$buildings.aicore.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.zebraBuildings")),
      this._getLimitedOption(
        "zebraOutpost",
        this._options.items.zebraOutpost,
        this._host.i18n("$buildings.zebraOutpost.label")
      ),
      this._getLimitedOption(
        "zebraWorkshop",
        this._options.items.zebraWorkshop,
        this._host.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getLimitedOption(
        "zebraForge",
        this._options.items.zebraForge,
        this._host.i18n("$buildings.zebraForge.label")
      ),
    ];
    list.append(optionButtons);

    element.panel.append(triggerButton);
    element.panel.append(list);

    this.element = element.panel;
  }

  private _getLimitedOption(
    name: string,
    option: BonfireSettingsItem,
    label: string,
    delimiter = false
  ): JQuery<HTMLElement> {
    const element = this._getOption(name, option, label, delimiter, {
      onCheck: () => {
        option.enabled = true;
        this._host.imessage("status.auto.enable", [label]);
      },
      onUnCheck: () => {
        option.enabled = false;
        this._host.imessage("status.auto.disable", [label]);
      },
    });

    const maxButton = $("<div/>", {
      id: `set-${name}-max`,
      //text: this._host.i18n("ui.max", []),
      //title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    }).data("option", option);
    option.$max = maxButton;

    maxButton.on("click", () => {
      const value = window.prompt(this._host.i18n("ui.max.set", [label]), option.max.toString());

      if (value !== null) {
        this._host.updateOptions(() => (option.max = parseInt(value)));
        maxButton[0].title = option.max.toString();
        maxButton[0].innerText = this._host.i18n("ui.max", [option.max]);
      }
    });

    element.append(maxButton);

    return element;
  }

  getState(): BonfireSettings {
    return {
      enabled: this._options.enabled,
      trigger: this._options.trigger,
      items: this._options.items,
    };
  }

  setState(state: BonfireSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(2);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$max).text(this._host.i18n("ui.max", [this._options.items[name].max]));
    }
  }
}
