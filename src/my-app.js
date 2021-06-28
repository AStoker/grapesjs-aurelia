import grapesjs from 'grapesjs';
import gjsForms from 'grapesjs-plugin-forms';

export class MyApp {

    attached() {
        const editor = grapesjs.init({
            container: this.gjs, //'#gjs',
            cssIcons: false,
            fromElement: true,
            height: '300px',
            width: 'auto',
            plugins: [
                gjsForms
            ],
            pluginsOpts: {
                [gjsForms]: {}
            },
            StorageManager: false,
            panels: {
                defaults: [
                    {
                        id: 'layers',
                        el: this.panelRight,
                        // Make the panel resizable
                        resizable: {
                            maxDim: 350,
                            minDim: 200,
                            tc: 0, // Top handler
                            cl: 1, // Left handler
                            cr: 0, // Right handler
                            bc: 0, // Bottom handler
                            // Being a flex child we need to change `flex-basis` property
                            // instead of the `width` (default)
                            keyWidth: 'flex-basis',
                        },
                    },
                    {
                        id: 'panel-switcher',
                        el: this.panelSwitcher,
                        buttons: [{
                            id: 'show-layers',
                            active: true,
                            label: 'Layers',
                            command: 'show-layers',
                            // Once activated disable the possibility to turn it off
                            togglable: false,
                        }, {
                            id: 'show-style',
                            active: true,
                            label: 'Styles',
                            command: 'show-styles',
                            togglable: false,
                        },
                        {
                            id: 'show-traits',
                            active: true,
                            label: 'Traits',
                            command: 'show-traits',
                            togglable: false,
                        }],
                    },
                    {
                        id: 'panel-devices',
                        el: this.panelDevices,
                        buttons: [{
                            id: 'device-desktop',
                            label: 'D',
                            command: 'set-device-desktop',
                            active: true,
                            togglable: false,
                          }, {
                            id: 'device-mobile',
                            label: 'M',
                            command: 'set-device-mobile',
                            togglable: false,
                        }],
                      }
                ]
            },
            blockManager: {
                appendTo: this.blocks,
                blocks: [{
                        id: 'section', // id is mandatory
                        label: '<b>Section</b>', // You can use HTML/SVG inside labels
                        attributes: {
                            class: 'gjs-block-section'
                        },
                        content: `<section>
                            <h1>This is a simple title</h1>
                            <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                        </section>`,
                    },
                    {
                        id: 'text',
                        label: 'Text',
                        content: '<div data-gjs-type="text">Insert your text here</div>',
                    },
                    {
                        id: 'image',
                        label: 'Image',
                        // Select the component once it's dropped
                        select: true,
                        // You can pass components as a JSON instead of a simple HTML string,
                        // in this case we also use a defined component type `image`
                        content: {
                            type: 'image'
                        },
                        // This triggers `active` event on dropped components and the `image`
                        // reacts by opening the AssetManager
                        activate: true,
                    }
                ]
            },
            layerManager: {
                appendTo: this.layersContainer
            },
            selectorManager: {
                appendTo: this.stylesContainer
            },
            styleManager: {
                appendTo: this.stylesContainer,
                sectors: [{
                    name: 'Dimension',
                    open: false,
                    // Use built-in properties
                    buildProps: ['width', 'min-height', 'padding'],
                    // Use `properties` to define/override single property
                    properties: [{
                        // Type of the input,
                        // options: integer | radio | select | color | slider | file | composite | stack
                        type: 'integer',
                        name: 'The width', // Label for the property
                        property: 'width', // CSS property (if buildProps contains it will be extended)
                        units: ['px', '%'], // Units, available only for 'integer' types
                        defaults: 'auto', // Default value
                        min: 0, // Min value, available only for 'integer' types
                    }]
                }, {
                    name: 'Extra',
                    open: false,
                    buildProps: ['background-color', 'box-shadow', 'custom-prop'],
                    properties: [{
                        id: 'custom-prop',
                        name: 'Custom Label',
                        property: 'font-size',
                        type: 'select',
                        defaults: '32px',
                        // List of options, available only for 'select' and 'radio'  types
                        options: [{
                                value: '12px',
                                name: 'Tiny'
                            },
                            {
                                value: '18px',
                                name: 'Medium'
                            },
                            {
                                value: '32px',
                                name: 'Big'
                            },
                        ],
                    }]
                }]
            },
            traitManager: {
                appendTo: this.traitsContainer
            },
            deviceManager: {
                devices: [
                    {
                        name: 'Desktop',
                        width: '', // default size
                    }, {
                        name: 'Mobile',
                        width: '320px', // this value will be used on canvas width
                        widthMedia: '480px', // this value will be used in CSS @media
                    }
                ]
            }
        });

        editor.Panels.addPanel({
            id: 'panel-top',
            el: this.panelTop,
        });
        editor.Panels.addPanel({
            id: 'basic-actions',
            el: this.panelBasicActions,
            buttons: [{
                id: 'visibility',
                active: true, // active by default
                className: 'btn-toggle-borders',
                label: '<u>B</u>',
                command: 'sw-visibility', // Built-in command
            }, {
                id: 'export',
                className: 'btn-open-export',
                label: 'Exp',
                command: 'export-template',
                context: 'export-template', // For grouping context of buttons from the same panel
            }, {
                id: 'show-json',
                className: 'btn-show-json',
                label: 'JSON',
                context: 'show-json',
                command(editor) {
                    editor.Modal.setTitle('Components JSON')
                        .setContent(`<textarea style="width:100%; height: 250px;">
                      ${JSON.stringify(editor.getComponents())}
                    </textarea>`)
                        .open();
                },
            }],
        });

        editor.Commands.add('show-traits', {
            getTraitsEl(editor) {
                const row = editor.getContainer().closest('.editor-row');
                return row.querySelector('.traits-container');
            },
            run(editor, sender) {
                this.getTraitsEl(editor).style.display = '';
            },
            stop(editor, sender) {
                this.getTraitsEl(editor).style.display = 'none';
            }
        });

        editor.Commands.add('set-device-desktop', {
            run: editor => editor.setDevice('Desktop')
        });
        editor.Commands.add('set-device-mobile', {
            run: editor => editor.setDevice('Mobile')
        });
    }

}