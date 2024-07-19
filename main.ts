import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

  showMessage(message: string) {
    new Notice(message);
  }

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

    this.addCommand({
			id: 'publish',
			name: 'publish',
			callback: async() => {
        this.showMessage("Publishing...");

        try {
          const response = await fetch('http://localhost:3009/run-commands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "*/*"
            },
            body: JSON.stringify({ msg: "hey" }),
            // body: JSON.stringify({ message: "hi" }),
          });
  
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
  
          const result = await response.text();
          // this.showMessage(`Success: ${result}`);
          this.showMessage(`Success!`);
  
        } catch (error) {
          this.showMessage(`Error: ${error.message}`);
        }
			}
		});
    

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}